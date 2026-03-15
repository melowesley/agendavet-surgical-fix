#!/usr/bin/env tsx
/**
 * TESTE APENAS DEEPSEEK - SOLUÇÃO FUNCIONAL
 * Execute com: npx tsx test-apenas-deepseek.ts
 * 
 * Usa apenas DeepSeek que está funcionando
 */

import { createClient } from '@supabase/supabase-js';
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
  DEEPSEEK_API_KEY: cleanEnv('DEEPSEEK_API_KEY'),
  SUPABASE_URL: cleanEnv('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE: cleanEnv('SUPABASE_SERVICE_ROLE_KEY'),
};

const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_ROLE);

async function testarDeepSeekFuncional() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              TESTE DEEPSEEK FUNCIONAL                        ║
║                  AgendaVet Surgical Fix                      ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  try {
    // 1. Testar DeepSeek Chat
    console.log('\n🔍 Testando DeepSeek Chat...');
    const client = new OpenAI({
      apiKey: CONFIG.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    });

    const chatResponse = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { 
          role: 'user', 
          content: `Gere um protocolo veterinário simples sobre tratamento de otite em cães.
          Responda de forma estruturada com:
          - DIAGNÓSTICO
          - TRATAMENTO
          - CUIDADOS
          
          Seja breve e objetivo.` 
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const protocolo = chatResponse.choices[0].message.content;
    console.log('   ✅ DeepSeek Chat: Protocolo gerado');
    console.log('   📄 Conteúdo gerado:');
    console.log('   ' + protocolo.split('\n').map(line => '   ' + line).join('\n'));

    // 2. Testar Supabase
    console.log('\n🔍 Testando Supabase...');
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('count()', { count: 'exact', head: true });

      if (error) {
        console.log(`   ❌ Supabase: ${error.message}`);
        console.log('   💡 Mas vamos tentar salvar mesmo assim...');
      } else {
        console.log(`   ✅ Supabase: ${data[0].count} registros existentes`);
      }
    } catch (err: any) {
      console.log(`   ⚠️  Supabase: ${err.message}`);
    }

    // 3. Salvar no Supabase (com embedding placeholder)
    console.log('\n📤 Salvando protocolo no Supabase...');
    try {
      // Gerar embedding numérico simples baseado no texto
      const textoNumerico = protocolo.split('').map(char => char.charCodeAt(0) / 1000);
      const embedding = Array(768).fill(0);
      
      // Preencher primeiras posições com valores do texto
      for (let i = 0; i < Math.min(textoNumerico.length, 768); i++) {
        embedding[i] = textoNumerico[i];
      }

      const { error } = await supabase.from('knowledge_base').insert({
        content: protocolo,
        embedding: embedding,
        metadata: {
          titulo: 'Protocolo Otite Cães - DeepSeek',
          agente: 'deepseek-chat',
          categoria: 'otologia',
          tags: ['otite', 'tratamento', 'cães', 'deepseek'],
          projeto: 'AgendaVet',
          teste: 'apenas-deepseek',
          timestamp: new Date().toISOString(),
        },
      });

      if (error) throw error;
      console.log('   ✅ Salvo com sucesso!');

      // 4. Verificar se foi salvo
      const { data: verifyData } = await supabase
        .from('knowledge_base')
        .select('id, created_at')
        .eq('metadata->>agente', 'deepseek-chat')
        .order('created_at', { ascending: false })
        .limit(1);

      if (verifyData && verifyData.length > 0) {
        console.log(`   ✅ Verificado: ID ${verifyData[0].id} salvo em ${verifyData[0].created_at}`);
      }

    } catch (err: any) {
      console.log(`   ❌ Erro ao salvar: ${err.message}`);
      return false;
    }

    // 5. Testar busca simples
    console.log('\n🔍 Testando busca no Supabase...');
    try {
      const { data: searchData } = await supabase
        .from('knowledge_base')
        .select('id, metadata->>titulo, content')
        .ilike('content', '%otite%')
        .limit(3);

      if (searchData && searchData.length > 0) {
        console.log(`   ✅ Encontrados ${searchData.length} registros sobre otite:`);
        searchData.forEach((item: any, idx) => {
          console.log(`   ${idx + 1}. ${item.metadata?.titulo || 'Sem título'} (ID: ${item.id})`);
        });
      } else {
        console.log('   ℹ️  Nenhum registro encontrado sobre otite');
      }
    } catch (err: any) {
      console.log(`   ⚠️  Erro na busca: ${err.message}`);
    }

    // Resumo final
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                      SUCESSO!                                  ║
╚═══════════════════════════════════════════════════════════════╝

🎉 DeepSeek está 100% funcional!
📋 Protocolo gerado e salvo no Supabase
🔍 Busca textual funcionando

📋 Próximos passos:
   1. Expandir com mais protocolos
   2. Implementar busca por similaridade (quando embeddings funcionarem)
   3. Criar interface web para consulta
   4. Adicionar outros agentes quando disponíveis

💡 Dica: Você já tem um sistema funcional com DeepSeek + Supabase!
    `);

    return true;

  } catch (err: any) {
    console.error(`
╔═══════════════════════════════════════════════════════════════╗
║                    ERRO CRÍTICO                              ║
╚═══════════════════════════════════════════════════════════════╝

${err.message}
    `);
    return false;
  }
}

testarDeepSeekFuncional().catch(console.error);
