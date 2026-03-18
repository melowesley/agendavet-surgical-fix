#!/usr/bin/env tsx
/**
 * TESTE UNIFICADO DOS TRÊS AGENTES IA
 * Execute com: npx tsx test-agentes-unificado.ts
 * 
 * Testa embedding generation para:
 * - Google Gemini (text-embedding-004)
 * - DeepSeek (deepseek-embed)
 * - Kimi/Moonshot (moonshot-v1)
 */

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import path from 'path';

// ==================== CONFIGURAÇÃO ====================
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Função de limpeza de environment variables (Windows)
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
  GEMINI_API_KEY: cleanEnv('GEMINI_API_KEY'),
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ? cleanEnv('DEEPSEEK_API_KEY') : null,
  KIMI_API_KEY: process.env.KIMI_API_KEY ? cleanEnv('KIMI_API_KEY') : null,
  SUPABASE_URL: cleanEnv('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE: cleanEnv('SUPABASE_SERVICE_ROLE_KEY'),
};

const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_ROLE);

// ==================== PROTOCOLO DE TESTE ====================
const PROTOCOLO_TESTE = {
  title: 'Protocolo de Tratamento de Otite em Cães',
  content: `
DIAGNÓSTICO:
- Otoscopia visual do canal auditivo
- Coleta de amostra para citologia (bactérias, leveduras, células inflamatórias)
- Cultura se infecção bacteriana recorrente

LIMPEZA:
- Usar solução otológica com ácido salicílico 2% ou clorexidina 2%
- Aplicar 2-3 gotas 2x ao dia por 7-10 dias
- Secar bem o canal após limpeza

MEDICAÇÃO ANTIFÚNGICA (se levedura):
- Miconazol 1% - 2 gotas 2x ao dia
- Duração: 14-21 dias
- Descontinuar quando citologia estiver negativa

MEDICAÇÃO ANTIBIÓTICA (se bactéria):
- Enrofloxacina 5 mg/kg ou Marbofloxacina 5 mg/kg
- Via: Tópica (otológica) 2x ao dia
- Sistêmica se inflamação severa: IM/IV por 7 dias

ANTI-INFLAMATÓRIO:
- Dexametasona 0.05-0.1 mg/kg IM por 3-5 dias (reduz edema)
- Ou Meloxicam 0.1-0.2 mg/kg VO 1x ao dia

SUPLEMENTAÇÃO:
- Óleo de peixe (Ômega-3) 40mg/kg diariamente
- Ácidos graxos essenciais para inflamação crônica

MONITORAMENTO:
- Reavaliação clínica após 10-14 dias
- Repetir citologia antes de descontinuar antibiótico
- Se refratária após 4 semanas, investigar causas subjacentes

PREVENÇÃO RECORRÊNCIA:
- Limpeza semanal em cães com otite crônica
- Secar orelhas após banho
- Controle de alérgenos (alimentar ou ambiental)
- Tratar parasitas (Otodectes cynotis)
  `.trim(),
};

// ==================== FUNÇÕES DE TESTE ====================
async function testarConexaoSupabase(): Promise<boolean> {
  try {
    console.log('\n🔗 Testando conexão com Supabase...');
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('count()', { count: 'exact', head: true });

    if (error) {
      console.error(`   ❌ Erro: ${error.message}`);
      return false;
    }

    console.log('   ✅ Supabase conectado com sucesso!');
    return true;
  } catch (err: any) {
    console.error(`   ❌ Erro crítico: ${err.message}`);
    return false;
  }
}

async function gerarEmbedding(
  agente: 'google' | 'deepseek' | 'kimi',
  texto: string
): Promise<number[] | null> {
  try {
    console.log(`\n🚀 Gerando embedding com ${agente.toUpperCase()}...`);

    let embedding: number[] = [];

    if (agente === 'google') {
      if (!CONFIG.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY não configurada');
      }

      console.log('   → Inicializando GoogleGenerativeAI...');
      const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

      console.log('   → Gerando embedding (text-embedding-004)...');
      const result = await model.embedContent(texto);
      embedding = result.embedding.values;

      console.log(`   ✅ Embedding gerado: ${embedding.length} dimensões`);
    } 
    else if (agente === 'deepseek') {
      if (!CONFIG.DEEPSEEK_API_KEY) {
        throw new Error('DEEPSEEK_API_KEY não configurada');
      }

      console.log('   → Inicializando DeepSeek OpenAI client...');
      const client = new OpenAI({
        apiKey: CONFIG.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com',
      });

      console.log('   → Gerando embedding (deepseek-embed)...');
      const result = await client.embeddings.create({
        model: 'deepseek-embed',
        input: texto,
      });

      embedding = result.data[0].embedding;
      console.log(`   ✅ Embedding gerado: ${embedding.length} dimensões`);
    } 
    else if (agente === 'kimi') {
      if (!CONFIG.KIMI_API_KEY) {
        throw new Error('KIMI_API_KEY não configurada');
      }

      console.log('   → Inicializando Moonshot (Kimi) OpenAI client...');
      const client = new OpenAI({
        apiKey: CONFIG.KIMI_API_KEY,
        baseURL: 'https://api.moonshot.cn/v1',
      });

      console.log('   → Gerando embedding (moonshot-v1)...');
      const result = await client.embeddings.create({
        model: 'moonshot-v1',
        input: texto,
      });

      embedding = result.data[0].embedding;
      console.log(`   ✅ Embedding gerado: ${embedding.length} dimensões`);
    }

    // VALIDAÇÃO CRÍTICA
    if (!embedding || embedding.length === 0) {
      throw new Error('Embedding vazio retornado pelo modelo');
    }

    // Ajustar para 768 dimensões se necessário
    if (embedding.length > 768) {
      console.log(`   ⚠️  Reduzindo de ${embedding.length} para 768 dimensões`);
      embedding = embedding.slice(0, 768);
    } else if (embedding.length < 768) {
      console.log(
        `   ⚠️  Embedding menor que esperado: ${embedding.length} (esperado 768)`
      );
      // Preenchendo com zeros (não ideal, mas funcional para testes)
      embedding = [...embedding, ...Array(768 - embedding.length).fill(0)];
    }

    return embedding;
  } catch (err: any) {
    console.error(`   ❌ Erro ao gerar embedding: ${err.message}`);
    return null;
  }
}

async function salvarNoSupabase(
  conteudo: string,
  embedding: number[],
  metadata: Record<string, any>
): Promise<boolean> {
  try {
    console.log('\n📤 Salvando no Supabase...');

    const { error } = await supabase.from('knowledge_base').insert({
      content: conteudo,
      embedding: embedding,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    });

    if (error) {
      console.error(`   ❌ Erro Supabase: ${error.message}`);
      return false;
    }

    console.log('   ✅ Protocolo salvo com sucesso!');
    return true;
  } catch (err: any) {
    console.error(`   ❌ Erro crítico ao salvar: ${err.message}`);
    return false;
  }
}

// ==================== EXECUÇÃO PRINCIPAL ====================
async function executarTesteAgente(agente: 'google' | 'deepseek' | 'kimi') {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              TESTE AGENTE IA - AGENDAVET                      ║
║                  Agente: ${agente.toUpperCase().padEnd(44)}║
╚═══════════════════════════════════════════════════════════════╝
  `);

  try {
    // PASSO 1: Validar conexão
    const supabaseOk = await testarConexaoSupabase();
    if (!supabaseOk) {
      throw new Error('Falha ao conectar com Supabase');
    }

    // PASSO 2: Gerar embedding
    const embedding = await gerarEmbedding(agente, PROTOCOLO_TESTE.content);
    if (!embedding) {
      throw new Error('Falha ao gerar embedding');
    }

    // PASSO 3: Salvar no banco
    const salvoOk = await salvarNoSupabase(PROTOCOLO_TESTE.content, embedding, {
      titulo: PROTOCOLO_TESTE.title,
      agente: agente,
      categoria: 'otologia',
      tags: ['otite', 'tratamento', 'antibiótico', 'cães'],
      projeto: 'AgendaVet',
      teste: 'unificado',
    });

    if (!salvoOk) {
      throw new Error('Falha ao salvar no Supabase');
    }

    // SUCESSO!
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    ✅ SUCESSO COMPLETO!                       ║
╚═══════════════════════════════════════════════════════════════╝

📊 Resumo:
   • Agente: ${agente.toUpperCase()}
   • Embedding: ${embedding.length} dimensões
   • Protocolo: "${PROTOCOLO_TESTE.title}"
   • Status: ✅ Salvo no Supabase
    `);

    return true;
  } catch (err: any) {
    console.error(`
╔═══════════════════════════════════════════════════════════════╗
║                    ❌ ERRO CRÍTICO                            ║
╚═══════════════════════════════════════════════════════════════╝

${err.message}
    `);
    return false;
  }
}

// ==================== EXECUTAR TODOS OS AGENTES ====================
async function executarTodosOsTestes() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║          TESTE UNIFICADO - TRÊS AGENTES IA                    ║
║                  AgendaVet Surgical Fix                      ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  const agentes: Array<'google' | 'deepseek' | 'kimi'> = ['google', 'deepseek', 'kimi'];
  const resultados: Record<string, boolean> = {};

  for (const agente of agentes) {
    console.log(`\n🔄 Iniciando teste do agente: ${agente.toUpperCase()}`);
    resultados[agente] = await executarTesteAgente(agente);
    
    // Pequena pausa entre testes para evitar rate limiting
    if (agentes.indexOf(agente) < agentes.length - 1) {
      console.log('\n⏱️  Aguardando 2 segundos antes do próximo teste...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // RESUMO FINAL
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                      RESUMO FINAL                             ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  Object.entries(resultados).forEach(([agente, sucesso]) => {
    const status = sucesso ? '✅ SUCESSO' : '❌ FALHA';
    console.log(`${status} - ${agente.toUpperCase()}`);
  });

  const todosSucesso = Object.values(resultados).every(v => v);
  
  console.log(`\n${todosSucesso ? '🎉' : '⚠️'} Status geral: ${
    todosSucesso ? 'TODOS OS AGENTES FUNCIONANDO!' : 'ALGUNS AGENTES COM PROBLEMAS'
  }`);

  if (!todosSucesso) {
    console.log('\n🔧 Recomendações:');
    Object.entries(resultados).forEach(([agente, sucesso]) => {
      if (!sucesso) {
        switch (agente) {
          case 'google':
            console.log(`   • ${agente.toUpperCase()}: Verifique se GEMINI_API_KEY começa com "AIzaSy"`);
            break;
          case 'deepseek':
            console.log(`   • ${agente.toUpperCase()}: Verifique se DEEPSEEK_API_KEY começa com "sk-"`);
            break;
          case 'kimi':
            console.log(`   • ${agente.toUpperCase()}: Verifique se KIMI_API_KEY começa com "sk-"`);
            break;
        }
      }
    });
  }
}

// EXECUTAR TESTES
executarTodosOsTestes().catch(console.error);
