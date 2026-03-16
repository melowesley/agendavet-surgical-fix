// ============================================================
// AgendaVet — Copilot (Ferramenta do Desenvolvedor)
// Arquivo: app/api/copilot/route.ts
// ACESSO: apenas user com app_metadata.role = 'developer'
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { COPILOT_SYSTEM_PROMPT } from '@/prompts/agent-prompts'

// ─── Tipos ───────────────────────────────────────────────────

interface CopilotCommand {
  type: '@copilot:inject' | '@copilot:reset' | '@copilot:show_profile' |
        '@copilot:list_vets' | '@copilot:set_model' | '@copilot:logs' | '@copilot:test'
  vet_id?: string
  persona?: string
  model_config?: { search: string; persona: string }
  limit?: number
  test_message?: string
}

// ─── Parser de comandos ───────────────────────────────────────

function parseCommand(message: string): CopilotCommand | null {
  const trimmed = message.trim()

  // @copilot:inject vet_id=UUID persona="..."
  const injectMatch = trimmed.match(/@copilot:inject\s+vet_id=([^\s]+)\s+persona="([^"]+)"/)
  if (injectMatch) {
    return { type: '@copilot:inject', vet_id: injectMatch[1], persona: injectMatch[2] }
  }

  // @copilot:inject com tone="..." ou outros campos
  const injectToneMatch = trimmed.match(/@copilot:inject\s+vet_id=([^\s]+)\s+(.+)/)
  if (injectToneMatch) {
    return { type: '@copilot:inject', vet_id: injectToneMatch[1], persona: injectToneMatch[2] }
  }

  // @copilot:reset vet_id=UUID
  const resetMatch = trimmed.match(/@copilot:reset\s+vet_id=([^\s]+)/)
  if (resetMatch) {
    return { type: '@copilot:reset', vet_id: resetMatch[1] }
  }

  // @copilot:show_profile vet_id=UUID
  const showMatch = trimmed.match(/@copilot:show_profile\s+vet_id=([^\s]+)/)
  if (showMatch) {
    return { type: '@copilot:show_profile', vet_id: showMatch[1] }
  }

  // @copilot:list_vets
  if (trimmed.startsWith('@copilot:list_vets')) {
    return { type: '@copilot:list_vets' }
  }

  // @copilot:set_model search=gemini persona=deepseek
  const modelMatch = trimmed.match(/@copilot:set_model\s+search=(\w+)\s+persona=(\w+)/)
  if (modelMatch) {
    return {
      type: '@copilot:set_model',
      model_config: { search: modelMatch[1], persona: modelMatch[2] },
    }
  }

  // @copilot:logs vet_id=UUID limit=20
  const logsMatch = trimmed.match(/@copilot:logs\s+vet_id=([^\s]+)(?:\s+limit=(\d+))?/)
  if (logsMatch) {
    return { type: '@copilot:logs', vet_id: logsMatch[1], limit: parseInt(logsMatch[2] ?? '20') }
  }

  // @copilot:test vet_id=UUID msg="..."
  const testMatch = trimmed.match(/@copilot:test\s+vet_id=([^\s]+)\s+msg="([^"]+)"/)
  if (testMatch) {
    return { type: '@copilot:test', vet_id: testMatch[1], test_message: testMatch[2] }
  }

  return null
}

// ─── Executores de comando ────────────────────────────────────

async function executeInject(
  supabase: ReturnType<typeof createClient>,
  developerId: string,
  vetId: string,
  personaText: string
): Promise<string> {
  // Parsear persona em JSON estruturado
  let personaConfig: Record<string, unknown> = {}

  // Tentar extrair campos do texto livre
  if (personaText.includes('tone=') || personaText.includes('tom=')) {
    const toneMatch = personaText.match(/(?:tone|tom)=["']?([^"'\s,]+)["']?/)
    if (toneMatch) personaConfig.tone = toneMatch[1]
  }
  if (personaText.includes('formal')) personaConfig.tone = 'formal'
  if (personaText.includes('técnico') || personaText.includes('técnica')) personaConfig.tone = 'tecnico'
  if (personaText.includes('empáti')) personaConfig.tone = 'empatico'

  // Se for texto livre de persona, salvar como custom_instructions
  if (Object.keys(personaConfig).length === 0) {
    personaConfig = { custom_instructions: personaText }
  }

  // Upsert no vet_ai_profiles
  const { error } = await supabase
    .from('vet_ai_profiles')
    .upsert(
      {
        vet_user_id: vetId,
        persona_config: personaConfig,
        injected_by: developerId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'vet_user_id' }
    )

  if (error) {
    throw new Error(`Falha ao injetar: ${error.message}`)
  }

  // Log do comando
  await supabase.from('vet_copilot_logs').insert({
    developer_id: developerId,
    target_vet_id: vetId,
    command: '@copilot:inject',
    payload: { persona_config: personaConfig },
    result: 'success',
  })

  return `✅ Personalidade injetada para o veterinário \`${vetId}\`.\nConfig aplicada: ${JSON.stringify(personaConfig, null, 2)}`
}

async function executeReset(
  supabase: ReturnType<typeof createClient>,
  developerId: string,
  vetId: string
): Promise<string> {
  const defaultConfig = {
    tone: 'profissional',
    formality: 'medio',
    greeting: '',
    signature: '',
    preferred_exam_style: 'detalhado',
    diagnosis_verbosity: 'moderado',
    custom_instructions: '',
  }

  const { error } = await supabase
    .from('vet_ai_profiles')
    .upsert(
      {
        vet_user_id: vetId,
        persona_config: defaultConfig,
        injected_by: developerId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'vet_user_id' }
    )

  if (error) throw new Error(`Falha ao resetar: ${error.message}`)

  await supabase.from('vet_copilot_logs').insert({
    developer_id: developerId,
    target_vet_id: vetId,
    command: '@copilot:reset',
    payload: null,
    result: 'success',
  })

  return `✅ Personalidade resetada para padrão. Veterinário: \`${vetId}\``
}

async function executeShowProfile(
  supabase: ReturnType<typeof createClient>,
  vetId: string
): Promise<string> {
  const { data, error } = await supabase
    .from('vet_ai_profiles')
    .select('persona_config, updated_at, injected_by')
    .eq('vet_user_id', vetId)
    .single()

  if (error || !data) {
    return `ℹ️ Nenhum perfil encontrado para \`${vetId}\`. A IA usa a personalidade padrão.`
  }

  return `📋 Perfil do veterinário \`${vetId}\`:\n\`\`\`json\n${JSON.stringify(data.persona_config, null, 2)}\n\`\`\`\nÚltima atualização: ${data.updated_at}`
}

async function executeListVets(
  supabase: ReturnType<typeof createClient>
): Promise<string> {
  const { data, error } = await supabase
    .from('clinic_members')
    .select('user_id, role, users:auth.users(email)')
    .limit(50)

  if (error || !data) return '❌ Não foi possível listar os veterinários.'

  const lines = data.map((m: { user_id: string; role: string; users?: { email?: string } }) =>
    `- \`${m.user_id}\` | ${(m.users as { email?: string })?.email ?? 'sem email'} | ${m.role}`
  )

  return `👥 Veterinários cadastrados (${data.length}):\n${lines.join('\n')}`
}

async function executeSetModel(
  supabase: ReturnType<typeof createClient>,
  developerId: string,
  config: { search: string; persona: string }
): Promise<string> {
  const validModels = ['gemini', 'deepseek', 'claude', 'gpt4o']

  if (!validModels.includes(config.search) || !validModels.includes(config.persona)) {
    return `❌ Modelos inválidos. Opções: ${validModels.join(', ')}`
  }

  const { error } = await supabase
    .from('vet_agent_config')
    .update({
      search_model: config.search,
      persona_model: config.persona,
      updated_by: developerId,
      updated_at: new Date().toISOString(),
    })
    .is('clinic_id', null)

  if (error) throw new Error(`Falha ao atualizar config: ${error.message}`)

  return `✅ Configuração de modelos atualizada:\n- Buscador: \`${config.search}\`\n- Personalidade: \`${config.persona}\``
}

async function executeLogs(
  supabase: ReturnType<typeof createClient>,
  vetId: string,
  limit: number
): Promise<string> {
  const { data, error } = await supabase
    .from('vet_copilot_logs')
    .select('command, payload, result, created_at')
    .eq('target_vet_id', vetId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data?.length) {
    return `ℹ️ Nenhum log encontrado para \`${vetId}\`.`
  }

  const lines = data.map((log: { created_at: string; command: string; result: string }) =>
    `[${new Date(log.created_at).toLocaleString('pt-BR')}] ${log.command} → ${log.result}`
  )

  return `📜 Últimos ${data.length} comandos para \`${vetId}\`:\n${lines.join('\n')}`
}

// ─── Handler principal ────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se é desenvolvedor via custom_claims
    const { data: { session } } = await supabase.auth.getSession()
    const appMetadata = session?.user?.app_metadata
    const isDeveloper = appMetadata?.role === 'developer'

    if (!isDeveloper) {
      return NextResponse.json(
        { error: 'Acesso negado. Este recurso é exclusivo do desenvolvedor.' },
        { status: 403 }
      )
    }

    const { message } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Mensagem vazia' }, { status: 400 })
    }

    // Verificar se é um comando @copilot
    const command = parseCommand(message)

    if (command) {
      let result: string

      switch (command.type) {
        case '@copilot:inject':
          result = await executeInject(supabase, user.id, command.vet_id!, command.persona!)
          break
        case '@copilot:reset':
          result = await executeReset(supabase, user.id, command.vet_id!)
          break
        case '@copilot:show_profile':
          result = await executeShowProfile(supabase, command.vet_id!)
          break
        case '@copilot:list_vets':
          result = await executeListVets(supabase)
          break
        case '@copilot:set_model':
          result = await executeSetModel(supabase, user.id, command.model_config!)
          break
        case '@copilot:logs':
          result = await executeLogs(supabase, command.vet_id!, command.limit ?? 20)
          break
        default:
          result = `❓ Comando não reconhecido: ${command.type}`
      }

      return NextResponse.json({ response: result, command_executed: command.type })
    }

    // Mensagem livre — responde via Gemini com o prompt do Copilot
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: COPILOT_SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: message }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 2000 },
        }),
      }
    )

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sem resposta'

    return NextResponse.json({ response: text })

  } catch (error) {
    console.error('[Copilot] Erro:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
