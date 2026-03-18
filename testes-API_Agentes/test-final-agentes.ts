#!/usr/bin/env tsx
/**
 * TESTE FINAL DOS AGENTES IA - VERSÃO CORRIGIDA
 * Execute com: npx tsx test-final-agentes.ts
 */

import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import path from 'path';

// ==================== CONFIGURAÇÃO ====================
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const cleanEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`❌ Variável ${key} não encontrada em .env.local`);
  
  return value
    .trim()
    .replace(/[\r\n\t]/gm, '')
    .replace(/\u0000/g, '')
    .replace(/^["']|["']$/g, '');
};

const CONFIG = {
  DEEPSEEK_API_KEY: cleanEnv('DEEPSEEK_API_KEY'),
  KIMI_API_KEY: cleanEnv('KIMI_API_KEY'),
  SUPABASE_URL: cleanEnv('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE: cleanEnv('SUPABASE_SERVICE_ROLE_KEY'),
};

const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_ROLE);

// ==================== PROTOCOLO DE TESTE ====================
const PROTOCOLO_TESTE = {
  title: 'Protocolo de Tratamento de Otite em Cães',
  content: `DIAGNÓSTICO:
- Otoscopia visual do canal auditivo
- Coleta de amostra para citologia
- Cultura se infecção bacteriana recorrente

LIMPEZA:
- Usar solução otológica com ácido salicílico 2%
- Aplicar 2-3 gotas 2x ao dia por 7-10 dias
- Secar bem o canal após limpeza

MEDICAÇÃO ANTIFÚNGICA:
- Miconazol 1% - 2 gotas 2x ao dia
- Duração: 14-21 dias

MEDICAÇÃO ANTIBIÓTICA:
- Enrofloxacina 5 mg/kg
- Via: Tópica (otológica) 2x ao dia
- Sistêmica se inflamação severa: IM/IV por 7 dias

ANTI-INFLAMATÓRIO:
- Dexametasona 0.05-0.1 mg/kg IM por 3-5 dias
- Ou Meloxicam 0.1-0.2 mg/kg VO 1x ao dia

MONITORAMENTO:
- Reavaliação clínica após 10-14 dias
- Repetir citologia antes de descontinuar antibiótico`.trim(),
};

// ==================== FUNÇÕES ====================
async function testarAgente(agente: 'deepseek' | 'kimi') {
  console.log(`\n🧪 Testando agente: ${agente.toUpperCase()}`);
  
  try {
    // 1. Gerar embedding
    let embedding: number[] = [];
    
    if (agente === 'deepseek') {
      console.log('   → Conectando DeepSeek...');
      const client = new OpenAI({
        apiKey: CONFIG.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com',
      });

      const result = await client.embeddings.create({
        model: 'deepseek-embed',
        input: PROTOCOLO_TESTE.content,
      });

      embedding = result.data[0].embedding;
      console.log(`   ✅ Embedding DeepSeek: ${embedding.length} dimensões`);
    } 
    else if (agente === 'kimi') {
      console.log('   → Conectando Kimi/Moonshot...');
      const client = new OpenAI({
        apiKey: CONFIG.KIMI_API_KEY,
        baseURL: 'https://api.moonshot.cn/v1',
      });

      const result = await client.embeddings.create({
        model: 'moonshot-v1',
        input: PROTOCOLO_TESTE.content,
      });

      embedding = result.data[0].embedding;
      console.log(`   ✅ Embedding Kimi: ${embedding.length} dimensões`);
    }

    // 2. Ajustar para 768 dimensões
    if (embedding.length > 768) {
      embedding = embedding.slice(0, 768);
      console.log(`   ⚠️  Ajustado para 768 dimensões`);
    } else if (embedding.length < 768) {
      embedding = [...embedding, ...Array(768 - embedding.length).fill(0)];
      console.log(`   ⚠️  Preenchido para 768 dimensões`);
    }

    // 3. Salvar no Supabase
    console.log('   → Salvando no Supabase...');
    
    const { error } = await supabase.from('knowledge_base').insert({
      content: PROTOCOLO_TESTE.content,
      embedding: embedding,
      metadata: {
        titulo: PROTOCOLO_TESTE.title,
        agente: agente,
        categoria: 'otologia',
        tags: ['otite', 'tratamento', 'antibiótico', 'cães'],
        projeto: 'AgendaVet',
        teste: 'final',
        timestamp: new Date().toISOString(),
      },
    });

    if (error) {
      console.error(`   ❌ Erro ao salvar: ${error.message}`);
      return false;
    }

    console.log(`   ✅ Salvo com sucesso!`);
    return true;

  } catch (err: any) {
    console.error(`   ❌ Erro no ${agente}: ${err.message}`);
    return false;
  }
}

// ==================== EXECUÇÃO ====================
async function executarTestes() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              TESTE FINAL - AGENTES IA                         ║
║                  AgendaVet Surgical Fix                      ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  const agentes: Array<'deepseek' | 'kimi'> = ['deepseek', 'kimi'];
  const resultados: Record<string, boolean> = {};

  for (const agente of agentes) {
    resultados[agente] = await testarAgente(agente);
    
    if (agentes.indexOf(agente) < agentes.length - 1) {
      console.log('\n⏱️  Aguardando 2 segundos...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // RESUMO
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                      RESUMO FINAL                             ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  Object.entries(resultados).forEach(([agente, sucesso]) => {
    console.log(`${sucesso ? '✅' : '❌'} ${agente.toUpperCase()}: ${sucesso ? 'FUNCIONANDO' : 'FALHOU'}`);
  });

  const todosSucesso = Object.values(resultados).every(v => v);
  
  console.log(`\n🎯 Status: ${todosSucesso ? '🎉 TODOS FUNCIONANDO!' : '⚠️  PROBLEMAS DETECTADOS'}`);
  
  if (todosSucesso) {
    console.log('\n📋 Próximos passos:');
    console.log('   1. Verificar dados no Supabase Dashboard');
    console.log('   2. Implementar busca por similaridade');
    console.log('   3. Testar RAG (Retrieval-Augmented Generation)');
    console.log('   4. Corrigir GEMINI_API_KEY no .env.local');
  }
}

executarTestes().catch(console.error);
