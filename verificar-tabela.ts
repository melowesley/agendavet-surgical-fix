#!/usr/bin/env tsx
/**
 * VERIFICAÇÃO DE TABELA SUPABASE
 * Execute com: npx tsx verificar-tabela.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const cleanEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Variável ${key} não encontrada`);
  
  return value
    .trim()
    .replace(/[\r\n\t]/gm, '')
    .replace(/\u0000/g, '')
    .replace(/^["']|["']$/g, '');
};

const supabase = createClient(
  cleanEnv('NEXT_PUBLIC_SUPABASE_URL'),
  cleanEnv('SUPABASE_SERVICE_ROLE_KEY')
);

async function verificarTabela() {
  try {
    console.log('🔍 Verificando tabela knowledge_base...');
    
    // Tentar fazer uma consulta simples
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao acessar tabela:', error.message);
      
      if (error.message.includes('does not exist')) {
        console.log('\n📋 A tabela não existe. Criando tabela knowledge_base...');
        
        // SQL para criar a tabela
        const createTableSQL = `
CREATE TABLE IF NOT EXISTS knowledge_base (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(768),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX ON knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
        `;
        
        console.log('⚠️  Execute este SQL no Supabase SQL Editor:');
        console.log(createTableSQL);
      }
      
      return false;
    }

    console.log('✅ Tabela knowledge_base acessível!');
    console.log('📊 Registros encontrados:', data.length);
    
    // Verificar estrutura
    if (data.length > 0) {
      console.log('📋 Estrutura do registro:');
      console.log(Object.keys(data[0]));
    }
    
    return true;
  } catch (err: any) {
    console.error('❌ Erro crítico:', err.message);
    return false;
  }
}

verificarTabela();
