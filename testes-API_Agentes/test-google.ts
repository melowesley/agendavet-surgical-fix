import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import path from 'path';

// Carrega o .env.local da raiz do projeto
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testGoogleAPI() {
  console.log('🔍 Testando Google AI API...');

  const chaveGemini = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  console.log(`🔑 Chave encontrada: ${chaveGemini ? 'SIM' : 'NÃO'}`);

  if (!chaveGemini) {
    console.log('❌ Nenhuma chave Google encontrada no .env.local');
    return false;
  }

  try {
    console.log('🚀 Inicializando Google AI...');
    const genAI = new GoogleGenerativeAI(chaveGemini);

    console.log('🧠 Testando modelo de embedding...');
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

    const testText = 'Teste de conexão AgendaVet';
    console.log(`📝 Texto de teste: "${testText}"`);

    const result = await model.embedContent(testText);
    const embedding = result.embedding.values;

    console.log(`✅ Google AI funcionando! Dimensões do embedding: ${embedding.length}`);
    return true;

  } catch (error: any) {
    console.log(`❌ Google AI falhou: ${error.message}`);
    console.log(`🔍 Código do erro: ${error.status || 'N/A'}`);
    return false;
  }
}

testGoogleAPI();
