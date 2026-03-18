#!/usr/bin/env tsx
/**
 * VERIFICAÇÃO DE CHAVES API
 * Execute com: npx tsx test-chaves-api.ts
 */

import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import path from 'path';
import fetch from 'node-fetch';

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

async function testDeepSeek() {
  console.log('\n🔍 Testando DeepSeek...');
  
  try {
    const apiKey = cleanEnv('DEEPSEEK_API_KEY');
    console.log(`   API Key: ${apiKey.substring(0, 10)}...`);
    
    // Testar endpoint de chat primeiro
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Teste' }],
        max_tokens: 10,
      }),
    });

    console.log(`   Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ DeepSeek Chat API funcionando!');
      
      // Agora testar embeddings
      try {
        const client = new OpenAI({
          apiKey: apiKey,
          baseURL: 'https://api.deepseek.com',
        });

        const result = await client.embeddings.create({
          model: 'deepseek-embed',
          input: 'texto de teste',
        });

        console.log(`   ✅ DeepSeek Embeddings: ${result.data[0].embedding.length} dimensões`);
        return true;
      } catch (err: any) {
        console.log(`   ❌ DeepSeek Embeddings: ${err.message}`);
        
        // Tentar modelo alternativo
        try {
          const result2 = await client.embeddings.create({
            model: 'text-embedding-ada-002', // modelo OpenAI padrão
            input: 'texto de teste',
          });
          console.log(`   ✅ DeepSeek (modelo alternativo): ${result2.data[0].embedding.length} dimensões`);
          return true;
        } catch (err2: any) {
          console.log(`   ❌ DeepSeek (alternativa): ${err2.message}`);
          return false;
        }
      }
    } else {
      const errorText = await response.text();
      console.log(`   ❌ Erro: ${errorText}`);
      return false;
    }
  } catch (err: any) {
    console.log(`   ❌ Erro: ${err.message}`);
    return false;
  }
}

async function testKimi() {
  console.log('\n🔍 Testando Kimi/Moonshot...');
  
  try {
    const apiKey = cleanEnv('KIMI_API_KEY');
    console.log(`   API Key: ${apiKey.substring(0, 10)}...`);
    
    // Testar endpoint de chat primeiro
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [{ role: 'user', content: 'Teste' }],
        max_tokens: 10,
      }),
    });

    console.log(`   Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Kimi Chat API funcionando!');
      
      // Agora testar embeddings
      try {
        const client = new OpenAI({
          apiKey: apiKey,
          baseURL: 'https://api.moonshot.cn/v1',
        });

        const result = await client.embeddings.create({
          model: 'moonshot-v1',
          input: 'texto de teste',
        });

        console.log(`   ✅ Kimi Embeddings: ${result.data[0].embedding.length} dimensões`);
        return true;
      } catch (err: any) {
        console.log(`   ❌ Kimi Embeddings: ${err.message}`);
        
        // Tentar modelo alternativo
        try {
          const result2 = await client.embeddings.create({
            model: 'text-embedding-ada-002', // modelo OpenAI padrão
            input: 'texto de teste',
          });
          console.log(`   ✅ Kimi (modelo alternativo): ${result2.data[0].embedding.length} dimensões`);
          return true;
        } catch (err2: any) {
          console.log(`   ❌ Kimi (alternativa): ${err2.message}`);
          return false;
        }
      }
    } else {
      const errorText = await response.text();
      console.log(`   ❌ Erro: ${errorText}`);
      return false;
    }
  } catch (err: any) {
    console.log(`   ❌ Erro: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              VERIFICAÇÃO DE CHAVES API                        ║
║                  AgendaVet Surgical Fix                      ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  const deepseekOk = await testDeepSeek();
  const kimiOk = await testKimi();

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                      RESUMO                                   ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  console.log(`${deepseekOk ? '✅' : '❌'} DeepSeek: ${deepseekOk ? 'FUNCIONANDO' : 'PROBLEMA'}`);
  console.log(`${kimiOk ? '✅' : '❌'} Kimi: ${kimiOk ? 'FUNCIONANDO' : 'PROBLEMA'}`);

  if (!deepseekOk || !kimiOk) {
    console.log('\n🔧 Sugestões:');
    if (!deepseekOk) {
      console.log('   • Verificar se DEEPSEEK_API_KEY está válida');
      console.log('   • Confirmar se a API suporta embeddings');
    }
    if (!kimiOk) {
      console.log('   • Verificar se KIMI_API_KEY está válida');
      console.log('   • Confirmar se a API suporta embeddings');
    }
  }
}

main().catch(console.error);
