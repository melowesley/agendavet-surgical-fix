import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: './.env.local' });

// Configurar cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const protocoloOtite = `Protocolo Clínica AgendaVet - Manejo de Otite Externa:
1. Limpeza com solução otológica neutra.
2. Coleta de material para citologia.
3. Tratamento tópico: Uso de [Insira aqui seu medicamento preferido] a cada 12h por 10 dias.
4. Retorno em 15 dias para nova avaliação.`;

async function testTableInsert() {
  try {
    console.log('🧠 Testando inserção simples na tabela knowledge_base...');

    // Inserir no Supabase sem embedding (null)
    const { data, error } = await supabase
      .from('knowledge_base')
      .insert({
        content: protocoloOtite,
        embedding: null, // Temporariamente null para testar
        metadata: { categoria: 'dermatologia', teste: true }
      })
      .select();

    if (error) {
      throw error;
    }

    console.log('🎉 Dados inseridos com sucesso!');
    console.log('📊 Dados inseridos:', {
      id: data?.[0]?.id,
      categoria: 'dermatologia',
      content_length: protocoloOtite.length
    });

  } catch (error) {
    console.error('❌ Erro ao inserir conhecimento:', error);
    process.exit(1);
  }
}

// Executar o script
testTableInsert();
