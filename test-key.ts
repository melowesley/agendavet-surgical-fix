import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: '.env.local' });

async function diagnosticoRapido() {
  // 1. Tenta ler as duas variações de nome que você mencionou
  const rawKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!rawKey) {
    console.error("❌ ERRO: Nenhuma chave encontrada no .env.local (Verifique se o nome é GEMINI_API_KEY ou GOOGLE_API_KEY)");
    return;
  }

  // 2. Limpeza rigorosa (importante para Windows!)
  const cleanKey = rawKey.trim().replace(/['" ]/g, "").replace(/[\r\n]/gm, "");

  console.log(`🔍 Testando chave iniciada em: ${cleanKey.substring(0, 7)}...`);

  try {
    const genAI = new GoogleGenerativeAI(cleanKey);
    // Usando o modelo específico de 768 dimensões para o AgendaVet
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    console.log("⏳ Solicitando embedding de teste...");
    
    const result = await model.embedContent("Teste de conexão AgendaVet");
    const dims = result.embedding.values.length;

    if (dims === 768) {
      console.log("✅ SUCESSO TOTAL!");
      console.log(`   - Conexão: OK`);
      console.log(`   - Dimensões: ${dims} (Perfeito para o seu pgvector)`);
    } else {
      console.log(`⚠️ ALERTA: Conectou, mas retornou ${dims} dimensões. Verifique o modelo.`);
    }

  } catch (error: any) {
    console.error("❌ FALHA NA AUTENTICAÇÃO:");
    if (error.message.includes("400")) {
      console.error("   - Erro 400: Chave inválida ou API 'Generative Language' não ativada no Cloud Console.");
    } else {
      console.error(`   - Detalhe: ${error.message}`);
    }
  }
}

diagnosticoRapido();