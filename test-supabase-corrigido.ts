#!/usr/bin/env tsx
/**
 * TESTE SUPABASE CORRIGIDO - CONEXÃO DIRETA
 * Execute com: npx tsx test-supabase-corrigido.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const cleanEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Variável ${key} não encontrada`);
  return value.trim().replace(/[\r\n\t]/gm, '').replace(/^["']|["']$/g, '');
};

async function testarSupabaseCorrigido() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              TESTE SUPABASE CORRIGIDO                        ║
║                  AgendaVet Surgical Fix                      ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  try {
    const supabaseUrl = cleanEnv('NEXT_PUBLIC_SUPABASE_URL');
    const supabaseKey = cleanEnv('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log(`🔑 URL: ${supabaseUrl}`);
    console.log(`🔑 Key: ${supabaseKey.substring(0, 20)}...`);

    // Testar conexão básica
    console.log('\n🔍 Testando conexão básica...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar se consegue acessar o serviço
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error && !error.message.includes('Auth session missing')) {
        throw error;
      }
      console.log('   ✅ Serviço Supabase acessível');
    } catch (err: any) {
      console.log(`   ⚠️  Auth: ${err.message}`);
    }

    // Listar tabelas disponíveis
    console.log('\n🔍 Verificando tabelas...');
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(10);

      if (error) {
        // Tentar método alternativo
        console.log('   ⚠️  Não foi possível listar tabelas, tentando acesso direto...');
        
        // Tentar acessar knowledge_base diretamente
        const { data: kbData, error: kbError } = await supabase
          .from('knowledge_base')
          .select('count()', { count: 'exact', head: true });

        if (kbError) {
          throw kbError;
        }
        
        console.log(`   ✅ knowledge_base: ${kbData[0].count} registros`);
      } else {
        console.log(`   ✅ Tabelas encontradas: ${data.length}`);
        data.forEach((t: any) => console.log(`      - ${t.table_name}`));
      }
    } catch (err: any) {
      console.log(`   ❌ Erro ao acessar tabelas: ${err.message}`);
      
      // Tentar criar tabela se não existir
      if (err.message.includes('does not exist') || err.message.includes('relation')) {
        console.log('\n💡 Tabela não existe. Criando knowledge_base...');
        
        const createSQL = `
-- Criar tabela knowledge_base
CREATE TABLE IF NOT EXISTS knowledge_base (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(768),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Criar índice para busca por similaridade
CREATE INDEX IF NOT EXISTS knowledge_base_embedding_idx 
ON knowledge_base USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Habilitar extensão vector se necessário
CREATE EXTENSION IF NOT EXISTS vector;
        `;
        
        console.log('📋 Execute este SQL no Supabase SQL Editor:');
        console.log(createSQL);
      }
    }

    // Testar inserção simples
    console.log('\n🔍 Testando inserção...');
    try {
      const { data, error } = await supabase.from('knowledge_base').insert({
        content: 'Teste de conexão com Supabase',
        embedding: Array(768).fill(0.1),
        metadata: {
          teste: 'conexão',
          timestamp: new Date().toISOString(),
        },
      }).select('id');

      if (error) throw error;
      console.log(`   ✅ Inserção funcionou: ID ${data[0].id}`);
    } catch (err: any) {
      console.log(`   ❌ Erro na inserção: ${err.message}`);
    }

    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    RESUMO SUPABASE                            ║
╚═══════════════════════════════════════════════════════════════╝
✅ URL configurada
✅ Chave de serviço presente
📋 Verifique se a tabela knowledge_base existe
📋 Execute o SQL acima se necessário
    `);

  } catch (err: any) {
    console.error(`❌ Erro geral: ${err.message}`);
    
    if (err.message.includes('NEXT_PUBLIC_SUPABASE_URL')) {
      console.log('\n💡 Verifique se .env.local tem:');
      console.log('NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co');
      console.log('SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico');
    }
  }
}

testarSupabaseCorrigido().catch(console.error);
