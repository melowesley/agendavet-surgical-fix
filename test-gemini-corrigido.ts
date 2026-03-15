#!/usr/bin/env tsx
/**
 * TESTE GEMINI CORRIGIDO - MODELOS DISPONÍVEIS
 * Execute com: npx tsx test-gemini-corrigido.ts
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const cleanEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Variável ${key} não encontrada`);
  return value.trim().replace(/[\r\n\t]/gm, '').replace(/^["']|["']$/g, '');
};

async function testarGeminiCorrigido() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              TESTE GEMINI CORRIGIDO                          ║
║                  AgendaVet Surgical Fix                      ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  try {
    const apiKey = cleanEnv('GEMINI_API_KEY');
    console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Tentar diferentes modelos disponíveis
    const modelosParaTestar = [
      { nome: 'gemini-1.5-flash', tipo: 'texto' },
      { nome: 'gemini-1.5-pro', tipo: 'texto' },
      { nome: 'gemini-pro', tipo: 'texto' },
      { nome: 'text-embedding-004', tipo: 'embedding' },
      { nome: 'embedding-001', tipo: 'embedding' }
    ];

    for (const modelo of modelosParaTestar) {
      console.log(`\n🔍 Testando modelo: ${modelo.nome} (${modelo.tipo})`);
      
      try {
        if (modelo.tipo === 'texto') {
          const model = genAI.getGenerativeModel({ model: modelo.nome });
          const result = await model.generateContent('Responda apenas: OK');
          console.log(`   ✅ ${modelo.nome}: Funciona para texto`);
        } else {
          // Para embeddings, tentar abordagem diferente
          try {
            const model = genAI.getGenerativeModel({ model: modelo.nome });
            const result = await model.embedContent('Teste');
            console.log(`   ✅ ${modelo.nome}: ${result.embedding.values.length} dimensões`);
          } catch (embedErr: any) {
            console.log(`   ❌ ${modelo.nome}: ${embedErr.message}`);
          }
        }
      } catch (err: any) {
        console.log(`   ❌ ${modelo.nome}: ${err.message}`);
      }
    }

    // Recomendação final
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    RECOMENDAÇÕES                              ║
╚═══════════════════════════════════════════════════════════════╝
💡 Se algum modelo de texto funcionou:
   • Use para gerar conteúdo textual
   • Para embeddings, use serviço alternativo

💡 Se nenhum funcionou:
   • Verifique se a chave API está correta
   • Confirme se a API está ativada no Google Cloud Console
   • Tente gerar nova chave em: https://makersuite.google.com/app/apikey
    `);

  } catch (err: any) {
    console.error(`❌ Erro geral: ${err.message}`);
  }
}

testarGeminiCorrigido().catch(console.error);
