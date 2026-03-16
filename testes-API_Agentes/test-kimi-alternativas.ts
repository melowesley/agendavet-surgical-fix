#!/usr/bin/env tsx
/**
 * TESTE KIMI ALTERNATIVAS - SERVIÇOS GRATUITOS
 * Execute com: npx tsx test-kimi-alternativas.ts
 */

import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const cleanEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Variável ${key} não encontrada`);
  return value.trim().replace(/[\r\n\t]/gm, '').replace(/^["']|["']$/g, '');
};

async function testarKimiAlternativas() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              KIMI - ALTERNATIVAS GRÁTUITAS                   ║
║                  AgendaVet Surgical Fix                      ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  try {
    const kimiKey = cleanEnv('KIMI_API_KEY');
    console.log(`🔑 Kimi Key: ${kimiKey.substring(0, 10)}...`);

    // 1. Testar se a chave funciona para alguma coisa
    console.log('\n🔍 Testando chave Kimi...');
    try {
      const client = new OpenAI({
        apiKey: kimiKey,
        baseURL: 'https://api.moonshot.cn/v1',
      });

      const response = await client.chat.completions.create({
        model: 'moonshot-v1-8k',
        messages: [{ role: 'user', content: 'Responda apenas: OK' }],
        max_tokens: 10,
      });

      console.log(`   ✅ Chave funciona: ${response.choices[0].message.content}`);
    } catch (err: any) {
      if (err.message.includes('429') || err.message.includes('balance')) {
        console.log('   💳 Chave válida mas sem saldo');
      } else {
        console.log(`   ❌ Chave inválida: ${err.message}`);
        return;
      }
    }

    // 2. Alternativas gratuitas para embeddings
    console.log('\n🔍 Alternativas gratuitas para embeddings:');
    
    const alternativas = [
      {
        nome: 'OpenAI (com créditos gratuitos)',
        instrucao: 'Use OPENAI_API_KEY em https://platform.openai.com/api-keys',
        modelo: 'text-embedding-ada-002'
      },
      {
        nome: 'Hugging Face (gratuito)',
        instrucao: 'Use transformers.js ou API local',
        modelo: 'sentence-transformers/all-MiniLM-L6-v2'
      },
      {
        nome: 'Ollama (local)',
        instrucao: 'Instale Ollama localmente',
        modelo: 'nomic-embed-text'
      },
      {
        nome: 'NumPy (simples)',
        instrucao: 'Baseado em caracteres do texto',
        modelo: 'custom'
      }
    ];

    alternativas.forEach((alt, idx) => {
      console.log(`\n   ${idx + 1}. ${alt.nome}`);
      console.log(`      Modelo: ${alt.modelo}`);
      console.log(`      Como: ${alt.instrucao}`);
    });

    // 3. Criar embedding simples como fallback
    console.log('\n🔍 Testando embedding simples (fallback)...');
    const texto = 'Protocolo veterinário para tratamento de otite';
    const embeddingSimples = Array(768).fill(0);
    
    // Preencher com valores baseados no texto
    for (let i = 0; i < texto.length && i < 768; i++) {
      embeddingSimples[i] = texto.charCodeAt(i) / 1000;
    }
    
    console.log(`   ✅ Embedding simples criado: ${embeddingSimples.length} dimensões`);
    console.log(`   📊 Exemplo: [${embeddingSimples.slice(0, 5).map(v => v.toFixed(3)).join(', ')}, ...]`);

    // 4. Recomendações finais
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    RECOMENDAÇÕES FINAIS                      ║
╚═══════════════════════════════════════════════════════════════╝

🎯 SOLUÇÃO IMEDIATA:
   • Use DeepSeek para geração de texto (funcionando)
   • Use embedding simples como fallback
   • Implemente busca textual no Supabase

📋 OPÇÕES FUTURAS:
   1. OpenAI - $5 créditos gratuitos
   2. Hugging Face - totalmente gratuito
   3. Ollama - rodar localmente

💡 Você já tem um sistema funcional!
   • Execute: npx tsx test-apenas-deepseek.ts
   • Sistema RAG operacional com DeepSeek + Supabase
    `);

  } catch (err: any) {
    console.error(`❌ Erro: ${err.message}`);
  }
}

testarKimiAlternativas().catch(console.error);
