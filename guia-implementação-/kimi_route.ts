// ============================================================
// AgendaVet — KIMI Brain (Orquestrador Backend)
// Arquivo: app/api/kimi/route.ts
// IMPORTANTE: Este arquivo deve estar no servidor, nunca no cliente
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  buildSearchAgentPrompt,
  buildPersonaAgentPrompt,
  buildSingleModelPrompt,
  KIMI_ORCHESTRATOR_PROMPT,
  type VetPersonaConfig,
  type PatientContext,
} from '@/prompts/agent-prompts'

// ─── Tipos ───────────────────────────────────────────────────

interface KimiRequest {
  message: string
  petId?: string
  sessionId?: string
  modelOverride?: {
    search: 'gemini' | 'deepseek'
    persona: 'gemini' | 'deepseek'
  }
}

interface OrchestrationDecision {
  pipeline: 'simple' | 'full'
  complexity: 'low' | 'medium' | 'high'
  guardrail_triggered: boolean
  guardrail_type: string | null
  learning_tags: string[]
  reasoning: string
}

// ─── Configurações dos modelos ────────────────────────────────

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

// ─── Funções de chamada de modelo ────────────────────────────

async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
  const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userMessage }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1500 },
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

async function callDeepSeek(systemPrompt: string, userMessage: string): Promise<string> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  })

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content ?? ''
}

async function callModel(
  model: 'gemini' | 'deepseek',
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  return model === 'gemini'
    ? callGemini(systemPrompt, userMessage)
    : callDeepSeek(systemPrompt, userMessage)
}

// ─── Funções de apoio ────────────────────────────────────────

async function getVetPersona(
  supabase: ReturnType<typeof createClient>,
  vetUserId: string
): Promise<VetPersonaConfig> {
  const { data } = await supabase
    .from('vet_ai_profiles')
    .select('persona_config')
    .eq('vet_user_id', vetUserId)
    .single()

  // Persona padrão se não houver configuração
  return (data?.persona_config as VetPersonaConfig) ?? {
    tone: 'profissional',
    formality: 'medio',
    greeting: '',
    signature: '',
    preferred_exam_style: 'detalhado',
    diagnosis_verbosity: 'moderado',
    custom_instructions: '',
  }
}

async function getPatientContext(
  supabase: ReturnType<typeof createClient>,
  petId: string
): Promise<PatientContext> {
  const { data: pet } = await supabase
    .from('pets')
    .select(`
      id, name, species, breed, birth_date, weight,
      exams:exams(name, created_at),
      medications:pet_medications(medication_name, active),
      diagnoses:pet_diagnoses(diagnosis, created_at),
      consultations:consultations(created_at, notes)
    `)
    .eq('id', petId)
    .single()

  if (!pet) return {}

  const ageYears = pet.birth_date
    ? Math.floor((Date.now() - new Date(pet.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365))
    : undefined

  return {
    petId: pet.id,
    petName: pet.name,
    species: pet.species,
    breed: pet.breed,
    age: ageYears,
    weight: pet.weight,
    recentExams: pet.exams?.slice(0, 5).map((e: { name: string }) => e.name) ?? [],
    medications: pet.medications
      ?.filter((m: { active: boolean }) => m.active)
      .map((m: { medication_name: string }) => m.medication_name) ?? [],
    diagnoses: pet.diagnoses?.slice(0, 3).map((d: { diagnosis: string }) => d.diagnosis) ?? [],
    lastConsultation: pet.consultations?.[0]?.created_at,
  }
}

async function getRagContext(
  supabase: ReturnType<typeof createClient>,
  vetUserId: string,
  queryEmbedding?: number[]
) {
  // Padrões comportamentais do veterinário
  const { data: patterns } = await supabase
    .from('vet_behavioral_patterns')
    .select('pattern_type, pattern_data, confidence')
    .eq('vet_user_id', vetUserId)
    .order('confidence', { ascending: false })
    .limit(5)

  const behavioralPatterns = patterns?.length
    ? patterns.map(p => `${p.pattern_type}: ${JSON.stringify(p.pattern_data)}`).join('\n')
    : undefined

  // Busca vetorial se tiver embedding da query
  let veterinaryKnowledge: string[] = []
  if (queryEmbedding) {
    const { data: vectors } = await supabase.rpc('search_vet_knowledge', {
      p_vet_user_id: vetUserId,
      p_query_embedding: queryEmbedding,
      p_match_count: 4,
      p_threshold: 0.7,
    })
    veterinaryKnowledge = vectors?.map((v: { content: string }) => v.content) ?? []
  }

  return { behavioralPatterns, veterinaryKnowledge }
}

async function checkGuardrails(
  supabase: ReturnType<typeof createClient>,
  message: string,
  vetUserId: string,
  sessionId?: string
): Promise<{ triggered: boolean; rule?: { rule_name: string; rule_type: string; action_config: Record<string, unknown> } }> {
  const { data: rules } = await supabase
    .from('clinical_guardrail_rules')
    .select('id, rule_name, rule_type, trigger_pattern, action_config, severity')
    .eq('is_active', true)
    .order('severity', { ascending: false }) // critical primeiro

  if (!rules) return { triggered: false }

  for (const rule of rules) {
    const regex = new RegExp(rule.trigger_pattern, 'i')
    if (regex.test(message)) {
      // Registrar ativação do guardrail
      await supabase.from('clinical_guardrail_logs').insert({
        vet_user_id: vetUserId,
        rule_id: rule.id,
        triggered_by: message.substring(0, 200),
        action_taken: rule.rule_type === 'block' ? 'blocked' : 'warned',
        session_id: sessionId,
      })

      return { triggered: true, rule }
    }
  }

  return { triggered: false }
}

async function recordLearningEvent(
  supabase: ReturnType<typeof createClient>,
  vetUserId: string,
  message: string,
  response: string,
  tags: string[],
  sessionId?: string
) {
  await supabase.from('vet_learning_events').insert({
    vet_user_id: vetUserId,
    event_type: 'ai_interaction',
    event_data: {
      query: message.substring(0, 500),
      response_preview: response.substring(0, 200),
      tags,
    },
    session_id: sessionId,
    processed: false,
  })
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

    const body: KimiRequest = await request.json()
    const { message, petId, sessionId, modelOverride } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Mensagem vazia' }, { status: 400 })
    }

    // 1. Verificar guardrails clínicos
    const guardrailCheck = await checkGuardrails(supabase, message, user.id, sessionId)
    if (guardrailCheck.triggered && guardrailCheck.rule?.rule_type === 'block') {
      return NextResponse.json({
        response: `⚠️ ${(guardrailCheck.rule.action_config as { message?: string }).message ?? 'Esta ação requer verificação clínica prévia.'}`,
        guardrail_triggered: true,
        guardrail_type: guardrailCheck.rule.rule_name,
      })
    }

    // 2. Carregar configuração de modelos
    const { data: agentConfig } = await supabase
      .from('vet_agent_config')
      .select('*')
      .is('clinic_id', null)
      .single()

    const searchModel = modelOverride?.search ?? agentConfig?.search_model ?? 'gemini'
    const personaModel = modelOverride?.persona ?? agentConfig?.persona_model ?? 'deepseek'

    // 3. KIMI decide o pipeline
    let orchestration: OrchestrationDecision = {
      pipeline: 'full',
      complexity: 'medium',
      guardrail_triggered: false,
      guardrail_type: null,
      learning_tags: ['ai_interaction'],
      reasoning: 'fallback padrão',
    }

    try {
      const orchestrationRaw = await callGemini(KIMI_ORCHESTRATOR_PROMPT, message)
      orchestration = JSON.parse(orchestrationRaw.replace(/```json\n?|\n?```/g, '').trim())
    } catch {
      // Continua com fallback
    }

    // 4. Carregar contextos em paralelo
    const [vetPersona, patientContext] = await Promise.all([
      getVetPersona(supabase, user.id),
      petId ? getPatientContext(supabase, petId) : Promise.resolve({} as PatientContext),
    ])

    const ragContext = await getRagContext(supabase, user.id)

    let finalResponse = ''

    // 5. Executar pipeline escolhido
    if (orchestration.pipeline === 'simple') {
      // Pipeline simples: 1 modelo
      const systemPrompt = buildSingleModelPrompt(vetPersona, patientContext)
      finalResponse = await callModel(personaModel as 'gemini' | 'deepseek', systemPrompt, message)
    } else {
      // Pipeline completo: busca → personalidade
      const searchPrompt = buildSearchAgentPrompt(patientContext, ragContext)
      const searchResult = await callModel(searchModel as 'gemini' | 'deepseek', searchPrompt, message)

      // Montar contexto para o agente de personalidade
      let contextForPersona = searchResult
      if (guardrailCheck.triggered && guardrailCheck.rule) {
        const cfg = guardrailCheck.rule.action_config as { message?: string; exams?: string[] }
        contextForPersona += `\n\n⚠️ ALERTA CLÍNICO: ${cfg.message ?? ''}`
        if (cfg.exams?.length) {
          contextForPersona += `\nExames recomendados: ${cfg.exams.join(', ')}`
        }
      }

      const personaPrompt = buildPersonaAgentPrompt(vetPersona, contextForPersona)
      finalResponse = await callModel(personaModel as 'gemini' | 'deepseek', personaPrompt, message)
    }

    // 6. Registrar evento de aprendizado (sem bloquear a resposta)
    recordLearningEvent(
      supabase,
      user.id,
      message,
      finalResponse,
      orchestration.learning_tags,
      sessionId
    ).catch(console.error)

    return NextResponse.json({
      response: finalResponse,
      pipeline_used: orchestration.pipeline,
      complexity: orchestration.complexity,
      guardrail_triggered: guardrailCheck.triggered,
      guardrail_type: guardrailCheck.rule?.rule_name ?? null,
    })

  } catch (error) {
    console.error('[KIMI] Erro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
