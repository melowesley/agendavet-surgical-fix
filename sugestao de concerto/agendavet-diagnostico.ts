#!/usr/bin/env tsx
/**
 * DIAGNÓSTICO COMPLETO AGENDAVET
 * Execute com: npx tsx agendavet-diagnostico.ts
 * 
 * Este script verifica:
 * 1. Variáveis de ambiente (limpeza Windows)
 * 2. Conectividade com cada API
 * 3. Status do Supabase
 * 4. Estrutura da tabela knowledge_base
 */

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';

// ==================== CONFIG ====================
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const cleanEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) return '';
  return value
    .trim()
    .replace(/[\r\n\t\u0000]/gm, '')
    .replace(/^["']|["']$/g, '');
};

const CONFIG = {
  GEMINI_KEY: cleanEnv('GEMINI_API_KEY'),
  DEEPSEEK_KEY: cleanEnv('DEEPSEEK_API_KEY'),
  KIMI_KEY: cleanEnv('KIMI_API_KEY'),
  SUPABASE_URL: cleanEnv('SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE: cleanEnv('SUPABASE_SERVICE_ROLE_KEY'),
};

// ==================== CORES PARA OUTPUT ====================
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  section: (title: string) => {
    console.log(`\n${colors.cyan}${'═'.repeat(60)}`);
    console.log(`  ${title}`);
    console.log(`${'═'.repeat(60)}${colors.reset}\n`);
  },
  success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
};

// ==================== FASE 1: VARIÁVEIS ====================
async function checkEnvironment() {
  log.section('FASE 1: VALIDAÇÃO DE VARIÁVEIS DE AMBIENTE');

  const checks = [
    { key: 'GEMINI_API_KEY', prefix: 'AIzaSy', label: 'Google Gemini' },
    { key: 'DEEPSEEK_API_KEY', prefix: 'sk-', label: 'DeepSeek' },
    { key: 'KIMI_API_KEY', prefix: 'sk-', label: 'Kimi (Moonshot)' },
    { key: 'SUPABASE_URL', prefix: 'https://', label: 'Supabase URL' },
    { key: 'SUPABASE_SERVICE_ROLE_KEY', prefix: 'eyJhbGc', label: 'Supabase Service Role' },
  ];

  let allValid = true;

  for (const check of checks) {
    const configKey = check.key
      .replace('GEMINI_', '')
      .replace('_API_KEY', '')
      .replace('_KEY', '') as keyof typeof CONFIG;
    
    const value = Object.values(CONFIG).find(
      (_, idx) => Object.keys(CONFIG)[idx] === configKey.toLowerCase()
    ) || CONFIG[Object.keys(CONFIG).find(k => k.includes(check.key.split('_')[0]))! as keyof typeof CONFIG];

    const cleanedValue = cleanEnv(check.key);

    if (!cleanedValue) {
      log.error(`${check.label} - NÃO ENCONTRADA`);
      allValid = false;
    } else if (!cleanedValue.startsWith(check.prefix)) {
      log.warning(`${check.label} - formato inesperado`);
      log.info(`Esperado: começa com "${check.prefix}", recebido: "${cleanedValue.substring(0, 15)}..."`);
      allValid = false;
    } else {
      log.success(`${check.label} - validada`);
      log.info(`Tamanho: ${cleanedValue.length} caracteres`);
    }
  }

  return allValid;
}

// ==================== FASE 2: GOOGLE GEMINI ====================
async function testGoogleGemini() {
  log.section('FASE 2: TESTANDO GOOGLE GEMINI');

  if (!CONFIG.GEMINI_KEY) {
    log.error('Chave GEMINI_API_KEY não encontrada');
    return false;
  }

  try {
    log.info('Inicializando GoogleGenerativeAI...');
    const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

    log.info('Gerando embedding de teste: "Protocolo de cirurgia veterinária"');
    const testText = 'Protocolo de cirurgia veterinária para castração de cães';
    const result = await model.embedContent(testText);

    const embedding = result.embedding.values;
    log.success(`Embedding gerado com sucesso!`);
    log.info(`Dimensões: ${embedding.length} (esperado: 768)`);
    
    if (embedding.length !== 768) {
      log.warning(`Dimensão inesperada! O Supabase pode estar configurado com outro tamanho.`);
    }

    return true;
  } catch (error: any) {
    log.error(`Erro ao testar Gemini: ${error.message}`);
    
    if (error.message.includes('400')) {
      log.info('💡 Erro 400 geralmente significa:');
      log.info('   - API não está ativada no Google Cloud Console');
      log.info('   - Chave não está associada ao projeto correto');
      log.info('   - Caracteres invisíveis na chave (.env.local)');
    }
    
    return false;
  }
}

// ==================== FASE 3: DEEPSEEK ====================
async function testDeepSeek() {
  log.section('FASE 3: TESTANDO DEEPSEEK');

  if (!CONFIG.DEEPSEEK_KEY) {
    log.error('Chave DEEPSEEK_API_KEY não encontrada');
    return false;
  }

  try {
    log.info('Testando autenticação DeepSeek...');
    
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.DEEPSEEK_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Teste' }],
        max_tokens: 10,
      }),
    }) as any;

    const data = await response.json() as any;

    if (response.status === 401) {
      log.error('Erro 401: Chave DeepSeek inválida ou expirada');
      log.warning('Verifique se a chave começa com "sk-"');
      return false;
    }

    if (response.ok) {
      log.success('DeepSeek autenticado com sucesso!');
      return true;
    }

    log.error(`Erro inesperado: ${response.status} - ${data.error?.message || 'desconhecido'}`);
    return false;
  } catch (error: any) {
    log.error(`Erro ao testar DeepSeek: ${error.message}`);
    return false;
  }
}

// ==================== FASE 4: SUPABASE ====================
async function testSupabase() {
  log.section('FASE 4: TESTANDO SUPABASE');

  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_SERVICE_ROLE) {
    log.error('Credenciais Supabase não encontradas');
    return false;
  }

  try {
    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_ROLE);

    log.info('Testando conexão com Supabase...');
    const { data, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      log.error(`Erro de autenticação: ${authError.message}`);
      return false;
    }

    log.success('Supabase autenticado com sucesso!');

    // Verificar tabela knowledge_base
    log.info('Verificando tabela knowledge_base...');
    const { data: tableData, error: tableError } = await supabase
      .from('knowledge_base')
      .select('*')
      .limit(1);

    if (tableError) {
      log.error(`Tabela não encontrada ou inacessível: ${tableError.message}`);
      log.info('💡 Execute esta query no Supabase SQL Editor:');
      console.log(`
CREATE TABLE IF NOT EXISTS knowledge_base (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(768),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX ON knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
      `);
      return false;
    }

    log.success('Tabela knowledge_base acessível!');
    
    // Verificar dimensões
    const { data: schemaData, error: schemaError } = await supabase
      .rpc('get_table_schema', { table_name: 'knowledge_base' }) as any;

    if (!schemaError && schemaData) {
      log.info(`Schema da tabela verificado`);
    }

    return true;
  } catch (error: any) {
    log.error(`Erro ao conectar Supabase: ${error.message}`);
    return false;
  }
}

// ==================== EXECUTAR TUDO ====================
async function runDiagnostics() {
  console.log(`
  ${colors.blue}╔════════════════════════════════════════════════════════════╗
  ║          DIAGNÓSTICO COMPLETO - AGENDAVET                 ║
  ║                  Por Wesley | v1.0                        ║
  ╚════════════════════════════════════════════════════════════╝${colors.reset}
  `);

  const results = {
    env: await checkEnvironment(),
    gemini: await testGoogleGemini(),
    deepseek: await testDeepSeek(),
    supabase: await testSupabase(),
  };

  log.section('RESUMO DO DIAGNÓSTICO');

  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? colors.green + '✅ PASSOU' : colors.red + '❌ FALHOU';
    console.log(`${status}${colors.reset} - ${test.toUpperCase()}`);
  });

  const allPassed = Object.values(results).every(v => v);
  
  console.log(`\n${allPassed ? colors.green : colors.red}${
    allPassed 
      ? '✅ TUDO FUNCIONANDO! Você pode rodar seed-knowledge.ts'
      : '❌ PROBLEMAS DETECTADOS - Revise os itens acima'
  }${colors.reset}\n`);
}

runDiagnostics().catch(console.error);
