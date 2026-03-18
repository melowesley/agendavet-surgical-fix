
import * as dotenv from 'dotenv';
import path from 'path';
import fetch from 'node-fetch';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testDeepSeekRAG() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const functionUrl = `${supabaseUrl}/functions/v1/ai_secretario`;
    
    console.log('🚀 Testando Edge Function com DeepSeek + Gemini RAG...');

    try {
        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({
                acao: 'consultar',
                provedor_ia: 'deepseek', // Testando DeepSeek como cérebro
                dados: "Rex, Labrador, claudicação membro posterior."
            })
        });

        const result: any = await response.json();
        if (result.sucesso) {
            console.log('✅ DeepSeek respondeu via Edge Function!');
            console.log('--- RESPOSTA ---');
            console.log(result.resultado.choices[0].message.content);
        } else {
            console.error('❌ Erro na Edge Function:', result);
        }
    } catch (error: any) {
        console.error('❌ Erro na requisição:', error.message);
    }
}

testDeepSeekRAG();
