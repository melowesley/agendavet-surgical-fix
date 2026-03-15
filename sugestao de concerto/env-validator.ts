// env-validator.ts
// Execute antes do seed-knowledge.ts para diagnosticar problemas

import dotenv from 'dotenv';
import path from 'path';

// Carrega do .env.local específico
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Função de limpeza rigorosa
const cleanEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) return '';
  return value
    .trim()                           // Remove espaços antes/depois
    .replace(/[\r\n\t]/gm, '')        // Remove quebras de linha e tabs
    .replace(/^["']|["']$/g, '')      // Remove aspas encapsulando
    .replace(/\u0000/g, '');          // Remove null bytes
};

// Validação cruzada
const validateKeys = () => {
  console.log('\n🔍 DIAGNÓSTICO DE VARIÁVEIS DE AMBIENTE\n');

  const keys = {
    GEMINI_API_KEY: 'Google Generative AI',
    DEEPSEEK_API_KEY: 'DeepSeek',
    KIMI_API_KEY: 'Kimi (Moonshot)',
    SUPABASE_URL: 'Supabase URL',
    SUPABASE_SERVICE_ROLE_KEY: 'Supabase Service Role',
  };

  const config: Record<string, string> = {};
  let hasErrors = false;

  for (const [key, label] of Object.entries(keys)) {
    const cleaned = cleanEnv(key);
    config[key] = cleaned;

    if (!cleaned) {
      console.log(`❌ ${key} - NÃO ENCONTRADA`);
      hasErrors = true;
    } else {
      // Mostra primeiros 20 chars + tamanho para debug
      const preview = cleaned.substring(0, 20) + '...';
      const length = cleaned.length;
      console.log(`✅ ${key} - ${label}`);
      console.log(`   Tamanho: ${length} caracteres`);
      console.log(`   Preview: ${preview}`);

      // Validações específicas
      if (key === 'GEMINI_API_KEY' && !cleaned.startsWith('AIzaSy')) {
        console.log(`   ⚠️  NÃO começa com 'AIzaSy' - pode estar incorreta`);
      }
      if (key === 'DEEPSEEK_API_KEY' && !cleaned.startsWith('sk-')) {
        console.log(`   ⚠️  NÃO começa com 'sk-' - pode estar incorreta`);
      }
      if (key === 'KIMI_API_KEY' && !cleaned.startsWith('sk-')) {
        console.log(`   ⚠️  NÃO começa com 'sk-' - pode estar incorreta`);
      }
      if (key.includes('URL') && !cleaned.startsWith('https://')) {
        console.log(`   ⚠️  NÃO é uma URL válida`);
      }
    }
    console.log();
  }

  if (hasErrors) {
    console.log('❌ ERRO: Variáveis obrigatórias faltando. Verifique .env.local\n');
    process.exit(1);
  }

  console.log('✅ Todas as variáveis validadas!\n');
  return config;
};

// Exporta o config limpo para usar em seed-knowledge.ts
export const CONFIG = validateKeys();
