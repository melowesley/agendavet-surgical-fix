-- ════════════════════════════════════════════════════════════════════════════════
-- SETUP SQL PARA AGENDAVET - KNOWLEDGE BASE
-- 
-- Copie e execute isto no Supabase SQL Editor:
-- https://app.supabase.com/project/[seu-projeto]/sql/new
-- 
-- Este script cria a tabela knowledge_base com pgvector para busca semântica
-- ════════════════════════════════════════════════════════════════════════════════

-- PASSO 1: Ativar extensão pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- PASSO 2: Criar tabela knowledge_base
CREATE TABLE IF NOT EXISTS knowledge_base (
  id BIGSERIAL PRIMARY KEY,
  
  -- Conteúdo do protocolo (texto completo)
  content TEXT NOT NULL,
  
  -- Embedding gerado pelo Google Generative AI (768 dimensões)
  embedding vector(768) NOT NULL,
  
  -- Metadados em JSON (título, categoria, tags, fonte, etc)
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Constraint: evitar duplicatas exatas
  UNIQUE(content)
);

-- PASSO 3: Criar índice IVFFlat para busca rápida por similaridade
-- Este índice otimiza buscas vetoriais usando cosine distance
CREATE INDEX IF NOT EXISTS knowledge_base_embedding_idx 
ON knowledge_base 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- PASSO 4: Criar índice em texto para busca por keyword
CREATE INDEX IF NOT EXISTS knowledge_base_content_idx 
ON knowledge_base USING GIN (to_tsvector('portuguese', content));

-- PASSO 5: Criar índice em metadados
CREATE INDEX IF NOT EXISTS knowledge_base_metadata_idx 
ON knowledge_base USING GIN (metadata);

-- PASSO 6: Ativar Row Level Security (RLS)
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- PASSO 7: Criar policy para SELECT (todos podem ler)
CREATE POLICY "Allow SELECT for all users" ON knowledge_base
  FOR SELECT
  USING (true);

-- PASSO 8: Criar policy para INSERT (apenas autenticados)
CREATE POLICY "Allow INSERT for authenticated users" ON knowledge_base
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- PASSO 9: Criar policy para UPDATE (apenas proprietário)
CREATE POLICY "Allow UPDATE for authenticated users" ON knowledge_base
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ════════════════════════════════════════════════════════════════════════════════
-- FUNÇÃO RPC: Buscar protocolos similares
-- 
-- Uso: SELECT * FROM match_documents(...);
-- ════════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 3
)
RETURNS TABLE (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_base.id,
    knowledge_base.content,
    knowledge_base.metadata,
    (1 - (knowledge_base.embedding <=> query_embedding)) as similarity
  FROM knowledge_base
  WHERE 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_base.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- ════════════════════════════════════════════════════════════════════════════════
-- FUNÇÃO RPC: Busca por texto + similaridade vetorial (híbrida)
-- ════════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION search_documents(
  query_text text,
  query_embedding vector(768),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id bigint,
  content text,
  metadata jsonb,
  similarity float,
  text_match_rank float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.content,
    kb.metadata,
    (1 - (kb.embedding <=> query_embedding)) as similarity,
    ts_rank(to_tsvector('portuguese', kb.content), 
            plainto_tsquery('portuguese', query_text)) as text_match_rank
  FROM knowledge_base kb
  WHERE 
    -- Busca vetorial OU busca textual
    (1 - (kb.embedding <=> query_embedding) > match_threshold)
    OR (to_tsvector('portuguese', kb.content) @@ plainto_tsquery('portuguese', query_text))
  ORDER BY 
    -- Priorizar busca vetorial, depois textual
    (1 - (kb.embedding <=> query_embedding)) DESC,
    ts_rank(to_tsvector('portuguese', kb.content), 
            plainto_tsquery('portuguese', query_text)) DESC
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- ════════════════════════════════════════════════════════════════════════════════
-- FUNÇÃO TRIGGER: Atualizar updated_at automaticamente
-- ════════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
CREATE TRIGGER update_knowledge_base_updated_at
  BEFORE UPDATE ON knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ════════════════════════════════════════════════════════════════════════════════
-- VISUALIZAÇÕES E QUERIES ÚTEIS
-- ════════════════════════════════════════════════════════════════════════════════

-- VER TODOS OS PROTOCOLOS COM METADADOS
-- SELECT id, metadata->>'title' as title, metadata->>'category' as category, created_at FROM knowledge_base;

-- CONTAR PROTOCOLOS POR CATEGORIA
-- SELECT metadata->>'category' as category, COUNT(*) as total FROM knowledge_base GROUP BY metadata->>'category';

-- VER TAMANHO DA TABELA
-- SELECT pg_size_pretty(pg_total_relation_size('knowledge_base'));

-- EXEMPLO DE BUSCA VETORIAL (execute após fazer seed)
-- SELECT 
--   id,
--   metadata->>'title' as title,
--   1 - (embedding <=> '[0.1, 0.2, ..., 0.768]'::vector) as similarity
-- FROM knowledge_base
-- ORDER BY embedding <=> '[0.1, 0.2, ..., 0.768]'::vector
-- LIMIT 3;

-- ════════════════════════════════════════════════════════════════════════════════
-- CONFIRMAÇÃO
-- ════════════════════════════════════════════════════════════════════════════════

-- Execute isto para verificar que tudo foi criado com sucesso:
-- SELECT 
--   'knowledge_base' as table_name,
--   COUNT(*) as total_records,
--   pg_size_pretty(pg_total_relation_size('knowledge_base')) as table_size
-- FROM knowledge_base;

-- Resultado esperado:
-- table_name | total_records | table_size
-- ------------|---------------|----------
-- knowledge_base | 0 | 8192 bytes (vazio inicialmente)
