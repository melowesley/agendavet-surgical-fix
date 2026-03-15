-- Verificar se a tabela knowledge_base existe
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'knowledge_base';

-- Se existir, mostrar estrutura
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'knowledge_base' 
ORDER BY ordinal_position;
