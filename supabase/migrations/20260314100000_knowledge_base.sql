-- Create knowledge_base table for RAG system
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX ON knowledge_base USING ivfflat (embedding vector_cosine_ops);

-- Enable RLS
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read
CREATE POLICY "Allow authenticated users to read knowledge_base" ON knowledge_base
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to insert (for admin API)
CREATE POLICY "Allow authenticated users to insert knowledge_base" ON knowledge_base
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
