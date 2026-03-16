// ============================================================
// AgendaVet — Learning Brain Worker
// Arquivo: app/api/learning/process/route.ts
//
// Como usar: chamada agendada (cron) a cada 15 minutos
// Supabase Edge Function ou Vercel Cron Job
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ─── Tipos ───────────────────────────────────────────────────

interface LearningEvent {
  id: string
  vet_user_id: string
  event_type: string
  event_data: Record<string, unknown>
  session_id?: string
  created_at: string
}

// ─── Geração de embeddings via Gemini ────────────────────────

async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'models/text-embedding-004',
          content: { parts: [{ text }] },
        }),
      }
    )

    if (!response.ok) return null
    const data = await response.json()
    return data.embedding?.values ?? null
  } catch {
    return null
  }
}

// ─── Análise de padrões comportamentais ──────────────────────

async function analyzeAndUpsertPattern(
  supabase: ReturnType<typeof createClient>,
  vetUserId: string,
  events: LearningEvent[]
) {
  // Agrupar eventos por tipo
  const consultations = events.filter(e => e.event_type === 'consultation')
  const aiInteractions = events.filter(e => e.event_type === 'ai_interaction')
  const examRequests = events.filter(e => e.event_type === 'exam_request')

  // Padrão: frequência de interações por horário
  if (aiInteractions.length >= 3) {
    const hours = aiInteractions.map(e => new Date(e.created_at).getHours())
    const avgHour = Math.round(hours.reduce((a, b) => a + b, 0) / hours.length)

    await supabase.from('vet_behavioral_patterns').upsert(
      {
        vet_user_id: vetUserId,
        pattern_type: 'usage_time',
        pattern_data: { avg_hour: avgHour, sample_size: aiInteractions.length },
        confidence: Math.min(aiInteractions.length / 20, 1.0),
        occurrence_count: aiInteractions.length,
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'vet_user_id,pattern_type,(pattern_data->>\'condition\')' }
    )
  }

  // Padrão: tags mais usadas nas interações
  if (aiInteractions.length > 0) {
    const allTags: string[] = aiInteractions.flatMap(e =>
      (e.event_data.tags as string[]) ?? []
    )
    const tagFreq: Record<string, number> = {}
    allTags.forEach(tag => { tagFreq[tag] = (tagFreq[tag] ?? 0) + 1 })

    const topTags = Object.entries(tagFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }))

    if (topTags.length > 0) {
      await supabase.from('vet_behavioral_patterns').upsert(
        {
          vet_user_id: vetUserId,
          pattern_type: 'query_topics',
          pattern_data: { top_tags: topTags },
          confidence: Math.min(allTags.length / 50, 1.0),
          occurrence_count: allTags.length,
          last_seen_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'vet_user_id,pattern_type,(pattern_data->>\'condition\')' }
      )
    }
  }

  // Padrão: tipos de consulta mais frequentes
  if (consultations.length > 0) {
    const conditions: string[] = consultations
      .map(e => e.event_data.condition as string)
      .filter(Boolean)

    const condFreq: Record<string, number> = {}
    conditions.forEach(c => { condFreq[c] = (condFreq[c] ?? 0) + 1 })

    for (const [condition, count] of Object.entries(condFreq)) {
      if (count >= 2) {
        await supabase.from('vet_behavioral_patterns').upsert(
          {
            vet_user_id: vetUserId,
            pattern_type: 'diagnosis_preference',
            pattern_data: { condition, occurrence: count },
            confidence: Math.min(count / 10, 0.9),
            occurrence_count: count,
            last_seen_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'vet_user_id,pattern_type,(pattern_data->>\'condition\')' }
        )
      }
    }
  }

  // Padrão: exames mais solicitados
  if (examRequests.length > 0) {
    const exams: string[] = examRequests
      .map(e => e.event_data.exam_name as string)
      .filter(Boolean)

    const examFreq: Record<string, number> = {}
    exams.forEach(e => { examFreq[e] = (examFreq[e] ?? 0) + 1 })

    const topExams = Object.entries(examFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    if (topExams.length > 0) {
      await supabase.from('vet_behavioral_patterns').upsert(
        {
          vet_user_id: vetUserId,
          pattern_type: 'exam_order',
          pattern_data: {
            top_exams: topExams.map(([exam, count]) => ({ exam, count })),
          },
          confidence: Math.min(examRequests.length / 20, 0.85),
          occurrence_count: examRequests.length,
          last_seen_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'vet_user_id,pattern_type,(pattern_data->>\'condition\')' }
      )
    }
  }
}

// ─── Geração de vetores de conhecimento ──────────────────────

async function generateKnowledgeVectors(
  supabase: ReturnType<typeof createClient>,
  vetUserId: string,
  events: LearningEvent[]
) {
  const interestingEvents = events.filter(e =>
    e.event_type === 'ai_interaction' &&
    e.event_data.query &&
    e.event_data.response_preview
  )

  for (const event of interestingEvents.slice(0, 10)) {
    const content = `Pergunta: ${event.event_data.query}\nResposta: ${event.event_data.response_preview}`
    const embedding = await generateEmbedding(content)

    if (embedding) {
      await supabase.from('vet_knowledge_vectors').insert({
        vet_user_id: vetUserId,
        content,
        embedding,
        source_type: 'interaction',
        source_id: event.id,
        metadata: {
          event_type: event.event_type,
          tags: event.event_data.tags,
          created_at: event.created_at,
        },
      })
    }

    // Rate limit: evitar sobrecarga na API
    await new Promise(r => setTimeout(r, 100))
  }
}

// ─── Handler principal ────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Verificar chave de cron (segurança)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const supabase = createClient()

    // Buscar eventos não processados (máx 200 por execução)
    const { data: events, error } = await supabase
      .from('vet_learning_events')
      .select('*')
      .eq('processed', false)
      .order('created_at', { ascending: true })
      .limit(200)

    if (error) throw error
    if (!events?.length) {
      return NextResponse.json({ message: 'Nenhum evento para processar', processed: 0 })
    }

    // Agrupar por veterinário
    const eventsByVet: Record<string, LearningEvent[]> = {}
    for (const event of events) {
      if (!event.vet_user_id) continue
      if (!eventsByVet[event.vet_user_id]) eventsByVet[event.vet_user_id] = []
      eventsByVet[event.vet_user_id].push(event as LearningEvent)
    }

    // Processar cada veterinário
    const promises = Object.entries(eventsByVet).map(async ([vetId, vetEvents]) => {
      await analyzeAndUpsertPattern(supabase, vetId, vetEvents)
      await generateKnowledgeVectors(supabase, vetId, vetEvents)
    })

    await Promise.allSettled(promises)

    // Marcar eventos como processados
    const processedIds = events.map(e => e.id)
    await supabase
      .from('vet_learning_events')
      .update({ processed: true })
      .in('id', processedIds)

    return NextResponse.json({
      message: 'Processamento concluído',
      processed: events.length,
      vets_affected: Object.keys(eventsByVet).length,
    })

  } catch (error) {
    console.error('[Learning] Erro:', error)
    return NextResponse.json({ error: 'Erro no processamento' }, { status: 500 })
  }
}

// Configuração do Vercel Cron (adicionar ao vercel.json):
// {
//   "crons": [{ "path": "/api/learning/process", "schedule": "*/15 * * * *" }]
// }
