import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // 1. Trata a requisição preflight do CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Inicializa o Supabase com o contexto do usuário (Veterinário/Admin)
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Opcional: Validar usuário antes de prosseguir
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error("Não autorizado");
    }

    // 3. Extrai o payload da requisição
    const { acao, provedor_ia, dados } = await req.json()
    let iaResponse = null;

    // 4. Fluxo de Memorização (Autoevolução)
    if (acao === 'memorizar') {
      const geminiKey = Deno.env.get('GEMINI_API_KEY');
      if (!geminiKey) throw new Error("GEMINI_API_KEY não configurada para embeddings.");

      // Formata os dados para o embedding
      const textoParaEmbedding = typeof dados === 'string' ? dados : JSON.stringify(dados);

      // Gera o embedding usando o modelo text-embedding-004
      const embeddingResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: { parts: [{ text: textoParaEmbedding }] }
        }),
      });

      const embeddingData = await embeddingResponse.json();
      const embedding = embeddingData.embedding?.values;

      if (!embedding) {
        throw new Error("Falha ao gerar embedding: " + JSON.stringify(embeddingData));
      }

      // Insere na tabela de memória clínica
      const { error: insertError } = await supabaseClient
        .from('ia_memoria_clinica')
        .insert({
          clinic_id: dados.clinic_id, // Pode ser extraído ou passado no payload
          user_id: user.id,
          pet_id: dados.pet_id,
          content: textoParaEmbedding,
          embedding: embedding,
          metadata: { 
            fonte: 'autoevolucao',
            timestamp: new Date().toISOString()
          }
        });

      if (insertError) throw insertError;

      return new Response(
        JSON.stringify({ sucesso: true, mensagem: "Caso memorizado com sucesso" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // 5. Fluxo de Consulta (Sugestão com RAG)
    let contextoMemoria = "";
    if (acao === 'consultar') {
      const geminiKey = Deno.env.get('GEMINI_API_KEY');
      if (geminiKey) {
        try {
          // Gera embedding da consulta
          const textoConsulta = typeof dados === 'string' ? dados : JSON.stringify(dados);
          const embeddingResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "models/text-embedding-004",
              content: { parts: [{ text: textoConsulta }] }
            }),
          });

          if (embeddingResponse.ok) {
            const embeddingData = await embeddingResponse.json();
            const embedding = embeddingData.embedding?.values;

            if (embedding) {
              // Busca casos semelhantes no banco
              const userClinicId = user.user_metadata?.clinic_id || dados.clinic_id;
              const { data: memorias, error: searchError } = await supabaseClient
                .rpc('search_ia_memoria', {
                  query_embedding: embedding,
                  match_threshold: 0.6,
                  match_count: 3,
                  filter_clinic_id: userClinicId
                });

              if (!searchError && memorias && memorias.length > 0) {
                contextoMemoria = "\n\nCONTEXTO DE MEMÓRIA CLÍNICA (Casos Anteriores Semelhantes):\n" +
                  memorias.map((m: any) => `- ${m.content}`).join('\n');
              }
            }
          }
        } catch (ragError) {
          console.error("Erro no RAG:", ragError);
          // Continua sem contexto se falhar
        }
      }
    }

    const systemInstruction = `Você é um assistente veterinário experiente. Analise os seguintes dados e forneça sugestões de diagnóstico ou conduta baseadas em evidências.${contextoMemoria}`;

    // 6. Roteamento para as APIs de IA
    const provider = provedor_ia || 'gemini';
    switch (provider) {
      case 'gemini': {
        const geminiKey = Deno.env.get('GEMINI_API_KEY');
        if (!geminiKey) throw new Error("GEMINI_API_KEY não configurada.");
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemInstruction}\n\nDados do paciente atual: ${JSON.stringify(dados)}` }] }]
          }),
        });
        iaResponse = await response.json();
        break;
      }

      case 'deepseek': {
        const deepseekKey = Deno.env.get('DEEPSEEK_API_KEY');
        if (!deepseekKey) throw new Error("DEEPSEEK_API_KEY não configurada.");

        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${deepseekKey}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: JSON.stringify(dados) }
            ],
          }),
        });
        iaResponse = await response.json();
        break;
      }

      case 'kimi': {
        const kimiKey = Deno.env.get('KIMI_API_KEY');
        if (!kimiKey) throw new Error("KIMI_API_KEY não configurada.");

        const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${kimiKey}`,
          },
          body: JSON.stringify({
            model: "moonshot-v1-8k",
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: JSON.stringify(dados) }
            ],
          }),
        });
        iaResponse = await response.json();
        break;
      }

      default:
        throw new Error(`Provedor de IA '${provider}' não suportado.`);
    }

    // 7. Retorna a resposta ao frontend
    return new Response(
      JSON.stringify({ sucesso: true, resultado: iaResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ sucesso: false, erro: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
