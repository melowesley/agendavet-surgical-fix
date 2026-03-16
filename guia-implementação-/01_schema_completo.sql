-- ============================================================
-- AgendaVet — Schema Completo de IA
-- Versão: 2.0 | Inclui RLS, Learning Brain, Copilot e Guardrails
-- ============================================================
-- ORDEM DE EXECUÇÃO:
-- 1. Habilitar extensão pgvector (se ainda não estiver ativa)
-- 2. Criar tabelas
-- 3. Criar índices
-- 4. Aplicar RLS policies
-- 5. Criar funções auxiliares
-- ============================================================

-- 1. EXTENSÃO
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- TABELA 1: vet_ai_profiles
-- Armazena a personalidade configurada por veterinário
-- Quem grava: apenas o desenvolvedor via Copilot
-- Quem lê: o backend ao montar o system prompt
-- ============================================================
CREATE TABLE IF NOT EXISTS vet_ai_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vet_user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  persona_config  JSONB NOT NULL DEFAULT '{
    "tone": "profissional",
    "formality": "medio",
    "greeting": "",
    "signature": "",
    "preferred_exam_style": "detalhado",
    "diagnosis_verbosity": "moderado",
    "custom_instructions": ""
  }',
  injected_by     UUID REFERENCES auth.users(id),
  version         INT NOT NULL DEFAULT 1,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(vet_user_id)
);

-- 2. TABELA: vet_copilot_logs
-- Registra todos os comandos @copilot executados pelo dev
-- Auditoria completa de mudanças de personalidade
CREATE TABLE IF NOT EXISTS vet_copilot_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id    UUID NOT NULL REFERENCES auth.users(id),
  target_vet_id   UUID REFERENCES auth.users(id),
  command         TEXT NOT NULL,         -- '@copilot:inject', '@copilot:reset', etc.
  payload         JSONB,                 -- dados do comando
  result          TEXT,                  -- 'success' | 'error'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TABELA: vet_agent_config
-- Configuração do role system (qual modelo faz o quê)
CREATE TABLE IF NOT EXISTS vet_agent_config (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id       UUID,                  -- NULL = configuração global
  search_model    TEXT NOT NULL DEFAULT 'gemini',     -- 'gemini' | 'deepseek'
  persona_model   TEXT NOT NULL DEFAULT 'deepseek',   -- 'gemini' | 'deepseek'
  pipeline_mode   TEXT NOT NULL DEFAULT 'sequential', -- 'sequential' | 'single'
  cost_mode       TEXT NOT NULL DEFAULT 'balanced',   -- 'economy' | 'balanced' | 'quality'
  updated_by      UUID REFERENCES auth.users(id),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Inserir configuração padrão
INSERT INTO vet_agent_config (search_model, persona_model, pipeline_mode, cost_mode)
VALUES ('gemini', 'deepseek', 'sequential', 'balanced')
ON CONFLICT DO NOTHING;

-- ============================================================
-- LEARNING BRAIN — 3 tabelas do motor de aprendizado
-- ============================================================

-- 4. TABELA: vet_learning_events
-- Registra TODAS as ações do sistema como eventos brutos
CREATE TABLE IF NOT EXISTS vet_learning_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vet_user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  clinic_id       UUID,
  event_type      TEXT NOT NULL, -- 'consultation','prescription','ai_interaction',
                                 -- 'exam_request','diagnosis','scheduling'
  event_data      JSONB NOT NULL DEFAULT '{}',
  session_id      TEXT,          -- agrupa eventos da mesma sessão
  processed       BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. TABELA: vet_behavioral_patterns
-- Padrões detectados pelo motor de análise
CREATE TABLE IF NOT EXISTS vet_behavioral_patterns (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vet_user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_type     TEXT NOT NULL, -- 'diagnosis_preference','exam_order',
                                  -- 'medication_choice','consultation_style'
  pattern_data     JSONB NOT NULL DEFAULT '{}',
  -- Exemplo: {
  --   "condition": "vomiting",
  --   "preferred_exams": ["hemograma", "ultrassom"],
  --   "typical_medications": ["metoclopramida"],
  --   "avg_consultation_duration": 25
  -- }
  confidence       FLOAT NOT NULL DEFAULT 0.0 CHECK (confidence BETWEEN 0 AND 1),
  occurrence_count INT NOT NULL DEFAULT 1,
  last_seen_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(vet_user_id, pattern_type, (pattern_data->>'condition'))
);

-- 6. TABELA: vet_knowledge_vectors
-- Embeddings para RAG contextual
CREATE TABLE IF NOT EXISTS vet_knowledge_vectors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vet_user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  clinic_id       UUID,
  content         TEXT NOT NULL,
  embedding       VECTOR(768),     -- Gemini text-embedding-004 = 768 dims
  source_type     TEXT NOT NULL,   -- 'interaction','decision','preference','protocol'
  source_id       UUID,            -- FK para o evento/consulta original
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- GUARDRAIL CLÍNICO — Segurança para software veterinário
-- ============================================================

-- 7. TABELA: clinical_guardrail_rules
-- Regras de bloqueio e alertas clínicos
CREATE TABLE IF NOT EXISTS clinical_guardrail_rules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name       TEXT NOT NULL UNIQUE,
  rule_type       TEXT NOT NULL, -- 'block','warn','require_exam','require_confirmation'
  trigger_pattern TEXT NOT NULL, -- padrão que ativa a regra (palavras-chave, regex)
  action_config   JSONB NOT NULL DEFAULT '{}',
  -- Exemplo block: { "message": "Requer exame antes de prescrição" }
  -- Exemplo require_exam: { "exams": ["hemograma", "bioquímica"] }
  is_active       BOOLEAN NOT NULL DEFAULT true,
  severity        TEXT NOT NULL DEFAULT 'medium', -- 'low','medium','high','critical'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Inserir regras padrão de segurança clínica
INSERT INTO clinical_guardrail_rules (rule_name, rule_type, trigger_pattern, action_config, severity) VALUES
('no_prescription_without_exam', 'require_exam', 'prescrever|receitar|administrar', 
 '{"message": "Prescrição requer exame prévio registrado.", "exams": ["anamnese"]}', 'high'),
('dangerous_drug_combination', 'block', 'AINEs.*corticoide|corticoide.*AINEs',
 '{"message": "Combinação potencialmente perigosa. Consulte protocolo clínico."}', 'critical'),
('dosage_confirmation', 'require_confirmation', 'mg/kg|dose|dosagem',
 '{"message": "Confirme o cálculo de dose antes de prosseguir."}', 'high'),
('anesthesia_protocol', 'require_exam', 'anestesia|sedação|cirurgia',
 '{"message": "Protocolo anestésico requer exames pré-operatórios.", "exams": ["hemograma","bioquímica","eletrocardiograma"]}', 'critical')
ON CONFLICT DO NOTHING;

-- 8. TABELA: clinical_guardrail_logs
-- Registra todas as ativações de guardrail
CREATE TABLE IF NOT EXISTS clinical_guardrail_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vet_user_id     UUID REFERENCES auth.users(id),
  rule_id         UUID REFERENCES clinical_guardrail_rules(id),
  triggered_by    TEXT,          -- trecho do texto que ativou a regra
  action_taken    TEXT,          -- 'blocked','warned','confirmed','bypassed'
  session_id      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ÍNDICES — Performance
-- ============================================================

-- Learning events: busca por vet + tipo + não processados
CREATE INDEX IF NOT EXISTS idx_learning_events_vet_type 
  ON vet_learning_events(vet_user_id, event_type);
CREATE INDEX IF NOT EXISTS idx_learning_events_unprocessed 
  ON vet_learning_events(processed) WHERE processed = false;
CREATE INDEX IF NOT EXISTS idx_learning_events_created 
  ON vet_learning_events(created_at DESC);

-- Behavioral patterns: busca por vet + tipo
CREATE INDEX IF NOT EXISTS idx_behavioral_patterns_vet 
  ON vet_behavioral_patterns(vet_user_id, pattern_type);
CREATE INDEX IF NOT EXISTS idx_behavioral_patterns_confidence 
  ON vet_behavioral_patterns(confidence DESC);

-- Knowledge vectors: busca vetorial por vet
CREATE INDEX IF NOT EXISTS idx_knowledge_vectors_vet 
  ON vet_knowledge_vectors(vet_user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_vectors_embedding 
  ON vet_knowledge_vectors USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Guardrail logs: busca por vet e data
CREATE INDEX IF NOT EXISTS idx_guardrail_logs_vet 
  ON clinical_guardrail_logs(vet_user_id, created_at DESC);

-- Copilot logs: auditoria por dev e data
CREATE INDEX IF NOT EXISTS idx_copilot_logs_dev 
  ON vet_copilot_logs(developer_id, created_at DESC);

-- ============================================================
-- RLS — Row Level Security
-- CRÍTICO: sem isso, vets veem dados uns dos outros
-- ============================================================

-- Habilitar RLS em todas as tabelas sensíveis
ALTER TABLE vet_ai_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vet_learning_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE vet_behavioral_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE vet_knowledge_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vet_copilot_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_guardrail_logs ENABLE ROW LEVEL SECURITY;

-- FUNÇÃO helper: checar se usuário é developer
-- O developer_role é definido via custom_claims no JWT do Supabase Auth
CREATE OR REPLACE FUNCTION auth.is_developer()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'developer',
    false
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- FUNÇÃO helper: checar se usuário é admin de clínica
CREATE OR REPLACE FUNCTION auth.is_clinic_admin(p_clinic_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM clinic_members
    WHERE user_id = auth.uid()
      AND clinic_id = p_clinic_id
      AND role IN ('admin', 'owner')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- vet_ai_profiles: vet vê apenas o próprio perfil; dev vê tudo
CREATE POLICY "vet_ai_profiles_select" ON vet_ai_profiles
  FOR SELECT USING (
    vet_user_id = auth.uid() OR auth.is_developer()
  );
CREATE POLICY "vet_ai_profiles_insert" ON vet_ai_profiles
  FOR INSERT WITH CHECK (auth.is_developer());
CREATE POLICY "vet_ai_profiles_update" ON vet_ai_profiles
  FOR UPDATE USING (auth.is_developer());
CREATE POLICY "vet_ai_profiles_delete" ON vet_ai_profiles
  FOR DELETE USING (auth.is_developer());

-- vet_learning_events: vet vê apenas os próprios; dev vê tudo
CREATE POLICY "learning_events_select" ON vet_learning_events
  FOR SELECT USING (
    vet_user_id = auth.uid() OR auth.is_developer()
  );
CREATE POLICY "learning_events_insert" ON vet_learning_events
  FOR INSERT WITH CHECK (
    vet_user_id = auth.uid() OR auth.is_developer()
  );

-- vet_behavioral_patterns: só o próprio vet ou dev
CREATE POLICY "behavioral_patterns_select" ON vet_behavioral_patterns
  FOR SELECT USING (
    vet_user_id = auth.uid() OR auth.is_developer()
  );
CREATE POLICY "behavioral_patterns_write" ON vet_behavioral_patterns
  FOR ALL USING (auth.is_developer());

-- vet_knowledge_vectors: só o próprio vet ou dev
CREATE POLICY "knowledge_vectors_select" ON vet_knowledge_vectors
  FOR SELECT USING (
    vet_user_id = auth.uid() OR auth.is_developer()
  );
CREATE POLICY "knowledge_vectors_write" ON vet_knowledge_vectors
  FOR ALL USING (auth.is_developer());

-- vet_copilot_logs: apenas developer lê e escreve
CREATE POLICY "copilot_logs_all" ON vet_copilot_logs
  FOR ALL USING (auth.is_developer());

-- clinical_guardrail_logs: vet vê os próprios; dev vê tudo
CREATE POLICY "guardrail_logs_select" ON clinical_guardrail_logs
  FOR SELECT USING (
    vet_user_id = auth.uid() OR auth.is_developer()
  );
CREATE POLICY "guardrail_logs_insert" ON clinical_guardrail_logs
  FOR INSERT WITH CHECK (
    vet_user_id = auth.uid() OR auth.is_developer()
  );

-- ============================================================
-- FUNÇÃO: busca vetorial para RAG
-- Usa cosine similarity para recuperar contexto relevante
-- ============================================================
CREATE OR REPLACE FUNCTION search_vet_knowledge(
  p_vet_user_id UUID,
  p_query_embedding VECTOR(768),
  p_match_count INT DEFAULT 5,
  p_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  source_type TEXT,
  metadata JSONB,
  similarity FLOAT
) AS $$
  SELECT
    id,
    content,
    source_type,
    metadata,
    1 - (embedding <=> p_query_embedding) AS similarity
  FROM vet_knowledge_vectors
  WHERE vet_user_id = p_vet_user_id
    AND 1 - (embedding <=> p_query_embedding) > p_threshold
  ORDER BY embedding <=> p_query_embedding
  LIMIT p_match_count;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- TRIGGER: atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vet_ai_profiles_updated_at
  BEFORE UPDATE ON vet_ai_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER vet_behavioral_patterns_updated_at
  BEFORE UPDATE ON vet_behavioral_patterns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
