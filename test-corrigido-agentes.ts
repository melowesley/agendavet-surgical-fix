#!/usr/bin/env tsx
/**
 * TESTE CORRIGIDO - AGENTES IA
 * Execute com: npx tsx test-corrigido-agentes.ts
 * 
 * Correções aplicadas:
 * - Gemini: Usar modelo correto de embedding
 * - DeepSeek: Verificar endpoint correto
 * - Kimi: Tratar erro de saldo
 * - Supabase: Debugar conexão
 */

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const cleanEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`❌ Variável ${key} não encontrada`);
  return value.trim().replace(/[\r\n\t]/gm, '').replace(/^["']|["']$/g, '');
};

const CONFIG = {
  GEMINI_API_KEY: cleanEnv('GEMINI_API_KEY'),
  DEEPSEEK_API_KEY: cleanEnv('DEEPSEEK_API_KEY'),
  KIMI_API_KEY: cleanEnv('KIMI_API_KEY'),
  SUPABASE_URL: cleanEnv('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE: cleanEnv('SUPABASE_SERVICE_ROLE_KEY'),
};

const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_ROLE);

async function testarGemini() {
  console.log('\n🔍 Testando Google Gemini...');
  
  try {
    const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
    
    // Listar modelos disponíveis primeiro
    console.log('   → Verificando modelos disponíveis...');
    const modelList = await genAI.listModels();
    
    // Procurar modelo de embedding
    const embeddingModels = modelList.models.filter(m => 
      m.name.includes('embedding') || m.supportedGenerationMethods?.includes('embedContent')
    );
    
    if (embeddingModels.length === 0) {
      console.log('   ⚠️  Nenhum modelo de embedding encontrado');
      console.log('   📋 Modelos disponíveis:', modelList.models.map(m => m.name).join(', '));
      
      // Tentar usar modelo de texto para teste
      console.log('   → Testando com modelo de texto (gemini-pro)...');
      const textModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await textModel.generateContent('Teste de conexão');
      console.log('   ✅ Gemini: Conexão funcionando (modelo de texto)');
      return { agente: 'Gemini', status: 'PARCIAL', info: 'Apenas texto, sem embeddings' };
    }
    
    // Usar primeiro modelo de embedding encontrado
    const embeddingModel = genAI.getGenerativeModel({ model: embeddingModels[0].name.split('/').pop() });
    const result = await embeddingModel.embedContent('Teste de embedding');
    console.log(`   ✅ Gemini: ${result.embedding.values.length} dimensões`);
    return { agente: 'Gemini', status: 'SUCESSO', dims: result.embedding.values.length };
    
  } catch (err: any) {
    console.log(`   ❌ Gemini: ${err.message}`);
    return { agente: 'Gemini', status: 'FALHA', erro: err.message };
  }
}

async function testarDeepSeek() {
  console.log('\n🔍 Testando DeepSeek...');
  
  try {
    // Testar chat primeiro
    const client = new OpenAI({
      apiKey: CONFIG.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com/v1', // Adicionar /v1
    });

    // Testar modelo de chat
    const chatResponse = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: 'Teste' }],
      max_tokens: 10,
    });
    
    console.log('   ✅ DeepSeek Chat: Funcionando');

    // Tentar embeddings
    try {
      const embeddingResponse = await client.embeddings.create({
        model: 'deepseek-embed',
        input: 'Teste de embedding',
      });
      
      console.log(`   ✅ DeepSeek Embeddings: ${embeddingResponse.data[0].embedding.length} dimensões`);
      return { agente: 'DeepSeek', status: 'SUCESSO', dims: embeddingResponse.data[0].embedding.length };
    } catch (embedErr: any) {
      console.log(`   ⚠️  DeepSeek Embeddings: ${embedErr.message}`);
      console.log('   💡 Usando apenas chat API');
      return { agente: 'DeepSeek', status: 'PARCIAL', info: 'Apenas chat, sem embeddings' };
    }
    
  } catch (err: any) {
    console.log(`   ❌ DeepSeek: ${err.message}`);
    return { agente: 'DeepSeek', status: 'FALHA', erro: err.message };
  }
}

async function testarKimi() {
  console.log('\n🔍 Testando Kimi...');
  
  try {
    const client = new OpenAI({
      apiKey: CONFIG.KIMI_API_KEY,
      baseURL: 'https://api.moonshot.cn/v1',
    });

    // Testar chat primeiro
    const chatResponse = await client.chat.completions.create({
      model: 'moonshot-v1-8k',
      messages: [{ role: 'user', content: 'Teste' }],
      max_tokens: 10,
    });
    
    console.log('   ✅ Kimi Chat: Funcionando');

    // Tentar embeddings
    try {
      const embeddingResponse = await client.embeddings.create({
        model: 'moonshot-v1',
        input: 'Teste de embedding',
      });
      
      console.log(`   ✅ Kimi Embeddings: ${embeddingResponse.data[0].embedding.length} dimensões`);
      return { agente: 'Kimi', status: 'SUCESSO', dims: embeddingResponse.data[0].embedding.length };
    } catch (embedErr: any) {
      if (embedErr.message.includes('429') || embedErr.message.includes('balance')) {
        console.log('   💳 Kimi: Conta sem saldo suficiente');
        return { agente: 'Kimi', status: 'SALDO_INSUFICIENTE', info: 'Recarregar conta' };
      } else {
        console.log(`   ⚠️  Kimi Embeddings: ${embedErr.message}`);
        return { agente: 'Kimi', status: 'PARCIAL', info: 'Apenas chat, sem embeddings' };
      }
    }
    
  } catch (err: any) {
    if (err.message.includes('429') || err.message.includes('balance')) {
      console.log('   💳 Kimi: Conta sem saldo suficiente');
      return { agente: 'Kimi', status: 'SALDO_INSUFICIENTE', info: 'Recarregar conta' };
    }
    console.log(`   ❌ Kimi: ${err.message}`);
    return { agente: 'Kimi', status: 'FALHA', erro: err.message };
  }
}

async function testarSupabase() {
  console.log('\n🔍 Testando Supabase...');
  
  try {
    // Testar conexão básica
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('count()', { count: 'exact', head: true });

    if (error) {
      console.log(`   ❌ Supabase: ${error.message}`);
      
      // Tentar verificar se tabela existe
      if (error.message.includes('does not exist')) {
        console.log('   💡 Tabela knowledge_base não existe');
        console.log('   📋 Execute o SQL no Supabase:');
        console.log(`
CREATE TABLE IF NOT EXISTS knowledge_base (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(768),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
        `);
      }
      return { agente: 'Supabase', status: 'FALHA', erro: error.message };
    }

    console.log(`   ✅ Supabase: Conectado (${data[0].count} registros)`);
    return { agente: 'Supabase', status: 'SUCESSO', registros: data[0].count };
    
  } catch (err: any) {
    console.log(`   ❌ Supabase: ${err.message}`);
    return { agente: 'Supabase', status: 'FALHA', erro: err.message };
  }
}

async function executarTestes() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              TESTE CORRIGIDO - AGENTES IA                      ║
║                  AgendaVet Surgical Fix                      ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  const resultados = [];
  
  resultados.push(await testarGemini());
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  resultados.push(await testarDeepSeek());
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  resultados.push(await testarKimi());
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  resultados.push(await testarSupabase());

  // Resumo detalhado
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                      RESUMO DETALHADO                        ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  resultados.forEach(r => {
    switch (r.status) {
      case 'SUCESSO':
        console.log(`✅ ${r.agente}: ${r.dims ? `${r.dims} dimensões` : `${r.registros} registros`}`);
        break;
      case 'PARCIAL':
        console.log(`⚠️  ${r.agente}: ${r.info}`);
        break;
      case 'SALDO_INSUFICIENTE':
        console.log(`💳 ${r.agente}: ${r.info}`);
        break;
      case 'FALHA':
        console.log(`❌ ${r.agente}: ${r.erro}`);
        break;
    }
  });

  const sucessos = resultados.filter(r => r.status === 'SUCESSO').length;
  const parciais = resultados.filter(r => r.status === 'PARCIAL').length;
  
  console.log(`\n🎯 Status: ${sucessos} completos, ${parciais} parciais, ${4 - sucessos - parciais} falhando`);

  // Recomendações
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    RECOMENDAÇÕES                              ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  if (sucessos >= 2) {
    console.log('🎉 BOM! Você já tem agentes suficientes para testar');
    console.log('📋 Execute: npx tsx test-final-agentes.ts');
  }

  resultados.forEach(r => {
    if (r.status === 'FALHA' || r.status === 'SALDO_INSUFICIENTE') {
      switch (r.agente) {
        case 'Gemini':
          console.log('• Gemini: Verifique se a chave está correta e se embeddings estão ativados');
          break;
        case 'DeepSeek':
          console.log('• DeepSeek: Verifique endpoint e se embeddings são suportados');
          break;
        case 'Kimi':
          console.log('• Kimi: Recarregue a conta ou use plano gratuito');
          break;
        case 'Supabase':
          console.log('• Supabase: Verifique credenciais e crie tabela knowledge_base');
          break;
      }
    }
  });
}

executarTestes().catch(console.error);
