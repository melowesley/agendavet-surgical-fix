#!/usr/bin/env tsx
/**
 * TESTE RÁPIDO PARA NOVAS CHAVES API
 * Execute com: npx tsx test-rapido-novas-chaves.ts
 * 
 * Use este script assim que atualizar as chaves no .env.local
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

async function testeRapido() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              TESTE RÁPIDO - NOVAS CHAVES API                   ║
║                  AgendaVet Surgical Fix                      ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  const resultados = [];

  // Testar Gemini
  try {
    console.log('\n🔍 Testando Google Gemini...');
    const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent('Teste de embedding com nova chave');
    console.log(`   ✅ Gemini: ${result.embedding.values.length} dimensões`);
    resultados.push({ agente: 'Gemini', status: '✅ SUCESSO', dims: result.embedding.values.length });
  } catch (err: any) {
    console.log(`   ❌ Gemini: ${err.message}`);
    resultados.push({ agente: 'Gemini', status: '❌ FALHA', erro: err.message });
  }

  // Testar DeepSeek
  try {
    console.log('\n🔍 Testando DeepSeek...');
    const client = new OpenAI({
      apiKey: CONFIG.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    });
    const result = await client.embeddings.create({
      model: 'deepseek-embed',
      input: 'Teste de embedding com nova chave',
    });
    console.log(`   ✅ DeepSeek: ${result.data[0].embedding.length} dimensões`);
    resultados.push({ agente: 'DeepSeek', status: '✅ SUCESSO', dims: result.data[0].embedding.length });
  } catch (err: any) {
    console.log(`   ❌ DeepSeek: ${err.message}`);
    resultados.push({ agente: 'DeepSeek', status: '❌ FALHA', erro: err.message });
  }

  // Testar Kimi
  try {
    console.log('\n🔍 Testando Kimi...');
    const client = new OpenAI({
      apiKey: CONFIG.KIMI_API_KEY,
      baseURL: 'https://api.moonshot.cn/v1',
    });
    const result = await client.embeddings.create({
      model: 'moonshot-v1',
      input: 'Teste de embedding com nova chave',
    });
    console.log(`   ✅ Kimi: ${result.data[0].embedding.length} dimensões`);
    resultados.push({ agente: 'Kimi', status: '✅ SUCESSO', dims: result.data[0].embedding.length });
  } catch (err: any) {
    console.log(`   ❌ Kimi: ${err.message}`);
    resultados.push({ agente: 'Kimi', status: '❌ FALHA', erro: err.message });
  }

  // Testar Supabase
  try {
    console.log('\n🔍 Testando Supabase...');
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('count()', { count: 'exact', head: true });
    
    if (error) throw error;
    console.log(`   ✅ Supabase: Conectado (${data[0].count} registros)`);
    resultados.push({ agente: 'Supabase', status: '✅ SUCESSO', registros: data[0].count });
  } catch (err: any) {
    console.log(`   ❌ Supabase: ${err.message}`);
    resultados.push({ agente: 'Supabase', status: '❌ FALHA', erro: err.message });
  }

  // Resumo
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                      RESUMO RÁPIDO                            ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  resultados.forEach(r => {
    if (r.status === '✅ SUCESSO') {
      console.log(`${r.status} - ${r.agente}: ${r.dims ? `${r.dims} dimensões` : `${r.registros} registros`}`);
    } else {
      console.log(`${r.status} - ${r.agente}: ${r.erro}`);
    }
  });

  const sucessos = resultados.filter(r => r.status === '✅ SUCESSO').length;
  console.log(`\n🎯 Total: ${sucessos}/4 funcionando`);

  if (sucessos === 4) {
    console.log('\n🎉 PERFEITO! Todas as APIs estão funcionando!');
    console.log('📋 Pronto para executar: npx tsx test-final-agentes.ts');
  } else {
    console.log('\n⚠️  Ainda há problemas a resolver.');
  }
}

testeRapido().catch(console.error);
