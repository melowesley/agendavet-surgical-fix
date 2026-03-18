#!/usr/bin/env tsx
/**
 * TESTE DEEPSEEK CORRIGIDO - ENDPOINT ATUALIZADO
 * Execute com: npx tsx test-deepseek-corrigido.ts
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

async function testarDeepSeekCorrigido() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              TESTE DEEPSEEK CORRIGIDO                        ║
║                  AgendaVet Surgical Fix                      ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  try {
    const apiKey = cleanEnv('DEEPSEEK_API_KEY');
    console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
    
    // Testar diferentes endpoints
    const endpointsParaTestar = [
      { url: 'https://api.deepseek.com', nome: 'Padrão' },
      { url: 'https://api.deepseek.com/v1', nome: 'v1' },
      { url: 'https://api.deepseek.com/beta', nome: 'beta' }
    ];

    for (const endpoint of endpointsParaTestar) {
      console.log(`\n🔍 Testando endpoint: ${endpoint.nome} (${endpoint.url})`);
      
      try {
        const client = new OpenAI({
          apiKey: apiKey,
          baseURL: endpoint.url,
        });

        // Testar chat primeiro
        const chatResponse = await client.chat.completions.create({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: 'Responda apenas: OK' }],
          max_tokens: 10,
        });
        
        console.log(`   ✅ Chat funcionando: ${chatResponse.choices[0].message.content}`);

        // Testar embeddings
        try {
          const embedResponse = await client.embeddings.create({
            model: 'deepseek-embed',
            input: 'Teste de embedding',
          });
          console.log(`   ✅ Embeddings: ${embedResponse.data[0].embedding.length} dimensões`);
        } catch (embedErr: any) {
          console.log(`   ⚠️  Embeddings: ${embedErr.message}`);
          
          // Tentar modelo alternativo
          try {
            const altResponse = await client.embeddings.create({
              model: 'text-embedding-ada-002',
              input: 'Teste de embedding',
            });
            console.log(`   ✅ Embeddings (alternativo): ${altResponse.data[0].embedding.length} dimensões`);
          } catch (altErr: any) {
            console.log(`   ❌ Embeddings (alternativo): ${altErr.message}`);
          }
        }

        // Se chegou aqui, o endpoint funciona
        console.log(`\n🎉 Endpoint ${endpoint.nome} está funcional!`);
        return;

      } catch (err: any) {
        console.log(`   ❌ Erro: ${err.message}`);
      }
    }

    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    RECOMENDAÇÕES                              ║
╚═══════════════════════════════════════════════════════════════╝
💡 Se nenhum endpoint funcionou:
   • Verifique se a chave API está válida
   • Confirme se tem créditos disponíveis
   • Tente gerar nova chave em: https://platform.deepseek.com/api_keys

💡 Se apenas chat funcionou:
   • Use para geração de texto
   • Para embeddings, use OpenAI ou outro serviço
    `);

  } catch (err: any) {
    console.error(`❌ Erro geral: ${err.message}`);
  }
}

testarDeepSeekCorrigido().catch(console.error);
