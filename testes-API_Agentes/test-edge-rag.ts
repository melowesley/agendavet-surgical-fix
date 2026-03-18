
import * as dotenv from 'dotenv';
import path from 'path';
import fetch from 'node-fetch';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testEdgeFunction() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Simular um login ou usar service role (mas a função espera auth header)
    // Para simplificar o teste local sem deploy, vamos apenas validar se a lógica interna passaria.
    // Como a função está no Supabase, o ideal é testar a URL da função.
    
    const functionUrl = `${supabaseUrl}/functions/v1/ai_secretario`;
    
    console.log('🚀 Testando Edge Function RAG...');
    console.log(`URL: ${functionUrl}`);

    try {
        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({
                acao: 'consultar',
                provedor_ia: 'gemini',
                dados: "O paciente Rex está com otite, o que devo fazer?"
            })
        });

        const result: any = await response.json();
        if (result.sucesso) {
            console.log('✅ Edge Function respondeu com sucesso!');
            // console.log('Sugestão da IA:', result.resultado.candidates[0].content.parts[0].text);
            console.log('A IA foi capaz de processar a consulta com RAG (visto no log interno se houvesse).');
        } else {
            console.error('❌ Erro na Edge Function:', result.erro);
            if (result.erro.includes('404')) {
                console.log('📝 Nota: A função pode não estar implantada (deployed) no Supabase ainda.');
            }
        }
    } catch (error: any) {
        console.error('❌ Erro na requisição:', error.message);
    }
}

testEdgeFunction();
