import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import path from 'path';

// Carrega o .env.local da raiz do projeto
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed(agente: 'google' | 'deepseek' | 'kimi') {
  // --- AJUSTE DA CHAVE (Sincronizado com seu .env.local) ---
  const chaveGemini = process.env.GEMINI_API_KEY?.trim();
  
  console.log(`🔍 DEBUG: Agente selecionado: ${agente.toUpperCase()}`);
  console.log(`🔍 DEBUG: Chave Gemini encontrada no arquivo? ${chaveGemini ? 'SIM' : 'NÃO'}`);
  
  if (chaveGemini) {
    console.log(`🔍 DEBUG: A chave começa com: "${chaveGemini.substring(0, 8)}..."`);
  }

  const texto = "Protocolo AgendaVet: Tratamento de Otite em cães...";
  let embedding: number[] = [];

  try {
    console.log(`\n🚀 Iniciando geração com: ${agente.toUpperCase()}`);

    if (agente === 'google') {
      if (!chaveGemini) throw new Error("Chave GEMINI_API_KEY não encontrada no .env.local");
      
      const genAI = new GoogleGenerativeAI(chaveGemini);
      // Usando o modelo de embedding mais recente do Google
      const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
      const res = await model.embedContent(texto);
      embedding = res.embedding.values;
    } 
    else if (agente === 'deepseek') {
      const ds = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY, baseURL: "https://api.deepseek.com" });
      const res = await ds.embeddings.create({ model: 'deepseek-embed', input: texto });
      embedding = res.data[0].embedding;
    }
    else if (agente === 'kimi') {
      const km = new OpenAI({ apiKey: process.env.KIMI_API_KEY, baseURL: "https://api.moonshot.cn/v1" });
      const res = await km.embeddings.create({ model: 'moonshot-v1', input: texto });
      embedding = res.data[0].embedding;
    }

    // Validação de segurança
    if (!embedding || embedding.length === 0) throw new Error("Falha ao gerar embedding.");

    // Enviar para o banco
    console.log(`📤 Enviando para o Supabase (${embedding.length} dimensões)...`);
    const { error } = await supabase.from('knowledge_base').insert({
      content: texto,
      embedding: embedding.slice(0, 768), // Ajustado para o padrão vector(768) do seu banco
      metadata: { fonte: agente, projeto: "AgendaVet" }
    });

    if (error) throw error;
    console.log("✅ Sucesso! Protocolo gravado na 'mina de ouro' do Supabase.");

  } catch (err: any) {
    console.error(`❌ Erro no ${agente}:`, err.message || err);
  }
}

// === EXECUTAR ===
// Agora o nome 'google' aqui vai bater com o 'if (agente === "google")' lá em cima
seed('deepseek');