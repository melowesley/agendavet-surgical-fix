import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import path from 'path';

// Carrega o .env.local da raiz do projeto
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testDeepSeekAPI() {
  console.log('🔍 Testando DeepSeek API...');

  const chaveDeepSeek = process.env.DEEPSEEK_API_KEY;
  console.log(`🔑 Chave encontrada: ${chaveDeepSeek ? 'SIM' : 'NÃO'}`);

  if (!chaveDeepSeek) {
    console.log('❌ Chave DEEPSEEK_API_KEY não encontrada no .env.local');
    return false;
  }

  try {
    console.log('🚀 Inicializando DeepSeek...');
    const ds = new OpenAI({
      apiKey: chaveDeepSeek,
      baseURL: "https://api.deepseek.com"
    });

    console.log('🧠 Testando modelo de embedding...');
    const testText = 'Teste de conexão AgendaVet';
    console.log(`📝 Texto de teste: "${testText}"`);

    const result = await ds.embeddings.create({
      model: 'text-embedding',
      input: testText
    });

    const embedding = result.data[0].embedding;
    console.log(`✅ DeepSeek funcionando! Dimensões do embedding: ${embedding.length}`);
    return true;

  } catch (error: any) {
    console.log(`❌ DeepSeek falhou: ${error.message}`);
    console.log(`🔍 Código do erro: ${error.status || 'N/A'}`);
    return false;
  }
}

testDeepSeekAPI();
