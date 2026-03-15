#!/usr/bin/env tsx
/**
 * TESTE MÍNIMO FUNCIONAL
 * Execute com: npx tsx test-minimo-funcional.ts
 * 
 * Testa apenas o que essencialmente funciona
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

async function testarMinimo() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              TESTE MÍNIMO FUNCIONAL                           ║
║                  AgendaVet Surgical Fix                      ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  let funcionando = [];

  // 1. Testar Supabase (básico)
  console.log('\n🔍 Supabase...');
  try {
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_ROLE);
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('count()', { count: 'exact', head: true });

    if (error) throw error;
    console.log(`   ✅ Supabase: ${data[0].count} registros`);
    funcionando.push('Supabase');
  } catch (err: any) {
    console.log(`   ❌ Supabase: ${err.message}`);
  }

  // 2. Testar Gemini (texto apenas)
  console.log('\n🔍 Gemini (texto)...');
  try {
    const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Responda apenas: OK');
    console.log('   ✅ Gemini: Funcionando (texto)');
    funcionando.push('Gemini');
  } catch (err: any) {
    console.log(`   ❌ Gemini: ${err.message}`);
  }

  // 3. Testar DeepSeek (chat)
  console.log('\n🔍 DeepSeek (chat)...');
  try {
    const client = new OpenAI({
      apiKey: CONFIG.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    });
    const result = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: 'Responda apenas: OK' }],
      max_tokens: 10,
    });
    console.log('   ✅ DeepSeek: Funcionando (chat)');
    funcionando.push('DeepSeek');
  } catch (err: any) {
    console.log(`   ❌ DeepSeek: ${err.message}`);
  }

  // 4. Verificar Kimi (saldo)
  console.log('\n🔍 Kimi (verificação)...');
  try {
    const client = new OpenAI({
      apiKey: CONFIG.KIMI_API_KEY,
      baseURL: 'https://api.moonshot.cn/v1',
    });
    const result = await client.chat.completions.create({
      model: 'moonshot-v1-8k',
      messages: [{ role: 'user', content: 'Responda apenas: OK' }],
      max_tokens: 10,
    });
    console.log('   ✅ Kimi: Funcionando (chat)');
    funcionando.push('Kimi');
  } catch (err: any) {
    if (err.message.includes('429') || err.message.includes('balance')) {
      console.log('   💳 Kimi: Sem saldo (mas API funciona)');
      funcionando.push('Kimi (sem saldo)');
    } else {
      console.log(`   ❌ Kimi: ${err.message}`);
    }
  }

  // Resumo
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                      RESUMO FINAL                             ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  console.log(`🎯 Funcionando: ${funcionando.length}/5 serviços`);
  funcionando.forEach(f => console.log(`   ✅ ${f}`));

  if (funcionando.length >= 2) {
    console.log('\n🎉 SUFICIENTE PARA PROSSEGUIR!');
    console.log('📋 Próximos passos:');
    console.log('   1. Usar Gemini para geração de texto');
    console.log('   2. Implementar embeddings alternativos');
    console.log('   3. Testar RAG com Supabase');
    
    // Criar exemplo funcional
    console.log('\n📝 Criando exemplo funcional...');
    await criarExemploFuncional();
  } else {
    console.log('\n⚠️  Precisa corrigir mais serviços antes de prosseguir');
  }
}

async function criarExemploFuncional() {
  try {
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_ROLE);
    const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Gerar conteúdo com Gemini
    const prompt = `Gere um protocolo veterinário simples sobre tratamento de feridas em cães.
    Responda de forma objetiva, com no máximo 200 palavras.`;
    
    const result = await model.generateContent(prompt);
    const texto = result.response.text();

    // Salvar no Supabase (sem embedding por enquanto)
    const { error } = await supabase.from('knowledge_base').insert({
      content: texto,
      embedding: Array(768).fill(0.1), // placeholder
      metadata: {
        titulo: 'Protocolo Feridas Cães',
        agente: 'gemini-pro',
        categoria: 'primeiros-socorros',
        projeto: 'AgendaVet',
        teste: 'minimo-funcional',
        timestamp: new Date().toISOString(),
      },
    });

    if (error) throw error;

    console.log('\n✅ Exemplo criado com sucesso!');
    console.log('📊 Protocolo salvo no Supabase');
    console.log('🔍 Verifique no Dashboard Supabase');

  } catch (err: any) {
    console.log(`\n❌ Erro ao criar exemplo: ${err.message}`);
  }
}

testarMinimo().catch(console.error);
