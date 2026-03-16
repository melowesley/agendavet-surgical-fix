import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fetch from 'node-fetch';

// Carrega o .env.local da raiz do projeto
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed(agente: 'google' | 'deepseek' | 'kimi') {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  
  console.log(`🔍 DEBUG: Agente selecionado: ${agente.toUpperCase()}`);
  
  const texto = "Protocolo Clínica AgendaVet - Manejo de Otite Externa:\n1. Limpeza com solução otológica neutra.\n2. Coleta de material para citologia.\n3. Tratamento tópico: Uso de [Medicamento] a cada 12h por 10 dias.\n4. Retorno em 15 dias.";
  let embedding: number[] = [];

  try {
    console.log(`\n🚀 Iniciando geração com: ${agente.toUpperCase()}`);

    if (agente === 'google') {
      if (!geminiKey) throw new Error("Chave GEMINI_API_KEY não encontrada no .env.local");
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "models/gemini-embedding-001",
          content: { parts: [{ text: texto }] },
          outputDimensionality: 768
        })
      });

      const data: any = await response.json();
      if (!data.embedding) throw new Error("Falha no Google: " + JSON.stringify(data));
      embedding = data.embedding.values;
    } 
    // ... deepseek e kimi omitidos ou mantidos se quiser, mas focando no Google agora
    
    if (!embedding || embedding.length === 0) throw new Error("Falha ao gerar embedding.");

    console.log(`📤 Enviando para o Supabase (${embedding.length} dimensões)...`);
    const { error } = await supabase.from('knowledge_base').insert({
      content: texto,
      embedding: embedding,
      metadata: { fonte: agente, projeto: "AgendaVet", timestamp: new Date().toISOString() }
    });

    if (error) throw error;
    console.log("✅ Sucesso! Protocolo gravado na 'mina de ouro' do Supabase.");

  } catch (err: any) {
    console.error(`❌ Erro no ${agente}:`, err.message || err);
  }
}

seed('google');