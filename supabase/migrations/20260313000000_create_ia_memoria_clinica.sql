-- ============================================
-- IA Memória Clínica (RAG para Autoevolução)
-- ============================================

-- Habilitar pgvector se não estiver (já deve estar pelo ai_copilot_module)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.ia_memoria_clinica (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  embedding vector(768),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para busca vetorial
CREATE INDEX idx_ia_memoria_embedding ON public.ia_memoria_clinica
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX idx_ia_memoria_clinic ON public.ia_memoria_clinica(clinic_id);

-- RLS
ALTER TABLE public.ia_memoria_clinica ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinic_member_read_memoria" ON public.ia_memoria_clinica
  FOR SELECT USING (
    clinic_id IN (SELECT clinic_id FROM public.clinic_members WHERE user_id = auth.uid())
  );

CREATE POLICY "clinic_member_insert_memoria" ON public.ia_memoria_clinica
  FOR INSERT WITH CHECK (
    clinic_id IN (SELECT clinic_id FROM public.clinic_members WHERE user_id = auth.uid())
  );

-- Função de Busca Vetorial para Memória Clínica
CREATE OR REPLACE FUNCTION public.search_ia_memoria(
  query_embedding vector(768),
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 5,
  filter_clinic_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity FLOAT,
  metadata JSONB
) AS $$
  SELECT
    id,
    content,
    1 - (embedding <=> query_embedding) AS similarity,
    metadata
  FROM public.ia_memoria_clinica
  WHERE
    (filter_clinic_id IS NULL OR clinic_id = filter_clinic_id)
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$ LANGUAGE sql STABLE;
