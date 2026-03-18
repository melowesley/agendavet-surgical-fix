
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fetch from 'node-fetch';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testRAG() {
    console.log('🚀 Iniciando Teste de RAG (AgendaVet)...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const geminiKey = process.env.GEMINI_API_KEY!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // 1. Gerar Embedding
        console.log('1️⃣ Gerando embedding com Gemini...');
        const text = "O paciente Rex, um Labrador de 5 anos, apresenta claudicação no membro posterior direito.";
        const embedResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "models/gemini-embedding-001",
                content: { parts: [{ text }] },
                outputDimensionality: 768
            })
        });

        const embedData: any = await embedResponse.json();
        if (!embedData.embedding) throw new Error('Falha ao gerar embedding');
        const embedding = embedData.embedding.values;
        console.log('   ✅ Embedding gerado (768 dimensões)');

        // 2. Inserir no Supabase
        console.log('2️⃣ Inserindo na tabela ia_memoria_clinica...');
        // Precisamos de um clinic_id e user_id válidos se as FKs forem estritas.
        // Vamos tentar inserir sem clinic_id primeiro (se permitido) ou pegar um existente.
        
        const { data: user } = await supabase.auth.admin.listUsers();
        const testUserId = user.users[0]?.id;

        const { data: insertData, error: insertError } = await supabase
            .from('ia_memoria_clinica')
            .insert({
                content: text,
                embedding: embedding,
                user_id: testUserId,
                metadata: { source: 'test-rag-script' }
            })
            .select();

        if (insertError) {
            console.error('   ❌ Erro na inserção:', insertError.message);
            if (insertError.message.includes('clinic_id')) {
                console.log('   💡 Dica: A tabela exige um clinic_id válido.');
            }
            return;
        }
        console.log('   ✅ Dado inserido com sucesso!');

        // 3. Buscar via RPC
        console.log('3️⃣ Testando busca vetorial (RPC search_ia_memoria)...');
        const { data: searchData, error: searchError } = await supabase.rpc('search_ia_memoria', {
            query_embedding: embedding,
            match_threshold: 0.8,
            match_count: 1
        });

        if (searchError) throw searchError;
        
        if (searchData && searchData.length > 0) {
            console.log('   ✅ Busca funcionou! Resultado encontrado:', searchData[0].content);
        } else {
            console.log('   ❌ Busca não retornou resultados (inesperado).');
        }

    } catch (error: any) {
        console.error('❌ Erro no teste de RAG:', error.message);
    }
}

testRAG();
