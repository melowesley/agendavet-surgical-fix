
import * as dotenv from 'dotenv';
import path from 'path';
import fetch from 'node-fetch';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testDeepSeek() {
    const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
    if (!apiKey) {
        console.error('❌ DEEPSEEK_API_KEY não encontrada');
        return;
    }

    console.log('🔍 Testando DeepSeek Chat...');
    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: 'Oi' }],
                max_tokens: 5,
            }),
        });

        if (response.ok) {
            const data: any = await response.json();
            console.log('   ✅ DeepSeek Chat: OK');
            console.log('   Resposta:', data.choices[0].message.content);
        } else {
            const errorText = await response.text();
            console.error(`   ❌ DeepSeek Chat: Erro (${response.status})`, errorText);
        }
    } catch (error: any) {
        console.error('   ❌ DeepSeek Chat: Exceção', error.message);
    }
}

testDeepSeek();
