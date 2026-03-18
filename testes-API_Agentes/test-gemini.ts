
import * as dotenv from 'dotenv';
import path from 'path';
import fetch from 'node-fetch';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY não encontrada no .env.local');
        return;
    }

    console.log('🔍 Testando Gemini AI (Modelos Ajustados)...');
    
    // 1. Testar Chat com gemini-2.0-flash
    try {
        const chatResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: 'Olá, você está funcionando?' }] }]
            })
        });

        if (chatResponse.ok) {
            console.log('   ✅ Gemini Chat (gemini-2.0-flash): OK');
        } else {
            console.error('   ❌ Gemini Chat (gemini-2.0-flash): Erro', await chatResponse.text());
        }
    } catch (error: any) {
        console.error('   ❌ Gemini Chat: Exceção', error.message);
    }

    // 2. Testar Embeddings com gemini-embedding-001
    try {
        const embedResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "models/gemini-embedding-001",
                content: { parts: [{ text: 'Teste de embedding para RAG' }] }
            })
        });

        if (embedResponse.ok) {
            const data: any = await embedResponse.json();
            if (data.embedding && data.embedding.values) {
                console.log(`   ✅ Gemini Embeddings (gemini-embedding-001): OK (${data.embedding.values.length} dimensões)`);
            } else {
                console.error('   ❌ Gemini Embeddings: Resposta inesperada', data);
            }
        } else {
            console.error('   ❌ Gemini Embeddings: Erro', await embedResponse.text());
        }
    } catch (error: any) {
        console.error('   ❌ Gemini Embeddings: Exceção', error.message);
    }
}

testGemini();
