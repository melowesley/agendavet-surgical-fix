╔═══════════════════════════════════════════════════════════════════════════════╗
║         GUIA COMPLETO DE TROUBLESHOOTING - AGENDAVET                         ║
║                    Resolvendo Erros 400/401                                  ║
╚═══════════════════════════════════════════════════════════════════════════════╝

## PROBLEMA #1: Erro 400 Bad Request (Google Gemini)
─────────────────────────────────────────────────────────────────────────────

SINTOMAS:
  • "API key not valid"
  • "Invalid API Key"
  • Erro ao chamar model.embedContent()

CAUSAS MAIS COMUNS:

1️⃣  CARACTERES INVISÍVEIS NO .env.local (WINDOWS)
   
   Problema: Windows PowerShell/CMD insere \r\n ao final das variáveis
   
   ✅ SOLUÇÃO:
   - Abra .env.local com Notepad++ ou VS Code
   - Menu: View → End of Line → Convert to LF
   - Ou adicione limpeza no código:
   
   ```typescript
   const cleanEnv = (key: string): string => {
     return (process.env[key] || '')
       .trim()
       .replace(/[\r\n\t]/gm, '')
       .replace(/\u0000/g, '');
   };
   ```

2️⃣  CHAVE INCORRETA (NOME DA VARIÁVEL)
   
   Problema: Você pode estar usando GOOGLE_API_KEY quando deveria ser GEMINI_API_KEY
   
   ✅ VERIFICAR:
   .env.local tem que ter EXATAMENTE:
   ```
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXX
   ```
   
   Não:
   ```
   GOOGLE_API_KEY=...
   GOOGLE_GENAI_KEY=...
   ```

3️⃣  API NÃO ATIVADA NO GOOGLE CLOUD
   
   Problema: Você gerou a chave, mas não ativou a API
   
   ✅ RESOLVER:
   a) Vá para: https://console.cloud.google.com/apis/library
   b) Pesquise: "Generative Language API"
   c) Clique e selecione seu projeto (agendavet-487822)
   d) Clique em "ATIVAR"
   e) Aguarde 30 segundos
   f) Teste novamente

4️⃣  RESTRIÇÕES DE IP OU REFERRER
   
   Problema: Chave com restrições que impedem uso do seu IP
   
   ✅ RESOLVER:
   a) Google Cloud Console
   b) APIs e Serviços → Credenciais
   c) Clique na chave (AIzaSy...)
   d) Seção "Restrições de chaves"
   e) Altere para "API HTTP referrers (web sites)"
   f) Clique "SALVAR"

5️⃣  PROJETO INCORRETO
   
   Problema: Chave gerada em um projeto, código usando outro
   
   ✅ VERIFICAR:
   - Abra Google Cloud Console
   - Topo esquerdo: veja qual projeto está selecionado
   - Deve ser "agendavet-487822"
   - Se não for, clique e selecione o correto
   - Gere NOVA chave nesse projeto

─────────────────────────────────────────────────────────────────────────────

## PROBLEMA #2: Erro 401 Authentication Fails (DeepSeek/Kimi)
─────────────────────────────────────────────────────────────────────────────

SINTOMAS:
  • "Authentication Failed"
  • "Invalid authentication"
  • "Unauthorized"
  • "API key invalid"

CAUSAS:

1️⃣  CHAVE GOOGLE SENDO ENVIADA PRA DEEPSEEK
   
   Problema: SEU CÓDIGO ORIGINAL - você estava fazendo:
   
   ❌ ERRADO:
   ```typescript
   if (agente === 'deepseek') {
     const chave = process.env.GEMINI_API_KEY;  // ← ERRADO!
     // Enviando chave AIzaSy... pro DeepSeek
   }
   ```
   
   ✅ CORRETO:
   ```typescript
   if (agente === 'deepseek') {
     const chave = process.env.DEEPSEEK_API_KEY;  // ← CERTO!
     // Enviando chave sk-... pro DeepSeek
   }
   ```
   
   💡 VALIDAÇÃO: Use esse switch case rigoroso:
   ```typescript
   const CONFIG = {
     GEMINI_API_KEY: cleanEnv('GEMINI_API_KEY'),      // AIzaSy...
     DEEPSEEK_API_KEY: cleanEnv('DEEPSEEK_API_KEY'),  // sk-...
     KIMI_API_KEY: cleanEnv('KIMI_API_KEY'),          // sk-...
   };
   ```

2️⃣  CHAVE EXPIRADA OU REVOGADA
   
   Problema: Você deletou a chave no DeepSeek/Moonshot
   
   ✅ RESOLVER:
   - DeepSeek: https://platform.deepseek.com/api_keys
   - Moonshot: https://platform.moonshot.cn/console/api-keys
   - Copie NOVA chave
   - Atualize .env.local
   - Remova quebras de linha

3️⃣  CARACTERES INVISÍVEIS NOVAMENTE
   
   ✅ VERIFICAR:
   - Cole a chave em um validador: https://www.base64decode.org/
   - Se vir caracteres estranhos = problema de limpeza
   - Use a função cleanEnv() do código corrigido

4️⃣  ENDPOINT ERRADO
   
   ❌ ERRADO:
   ```typescript
   baseURL: "https://deepseek.com"  // Não existe
   ```
   
   ✅ CORRETO:
   ```typescript
   baseURL: "https://api.deepseek.com"
   ```
   
   Para Kimi:
   ```typescript
   baseURL: "https://api.moonshot.cn/v1"
   ```

5️⃣  MODELO NÃO EXISTE
   
   ❌ ERRADO:
   ```typescript
   model: 'deepseek-embedding'  // Não existe
   model: 'moonshot-embed'       // Não existe
   ```
   
   ✅ CORRETO:
   ```typescript
   model: 'deepseek-embed'        // DeepSeek
   model: 'moonshot-v1'           // Kimi
   ```

─────────────────────────────────────────────────────────────────────────────

## PROBLEMA #3: Erro ao Salvar no Supabase
─────────────────────────────────────────────────────────────────────────────

SINTOMA: Embedding gerado com sucesso, mas falha ao inserir

1️⃣  DIMENSÃO INCORRETA
   
   ❌ ERRO:
   ```
   TypeError: embedding has 1536 dimensions, column expects 768
   ```
   
   ✅ SOLUÇÃO:
   ```typescript
   // Se receber 1536 (OpenAI), cortar para 768
   const embedding = fullEmbedding.slice(0, 768);
   ```

2️⃣  ESTRUTURA JSON ERRADA
   
   ❌ ERRADO:
   ```typescript
   await supabase.from('knowledge_base').insert({
     content: texto,
     embedding: { values: [1, 2, 3] },  // ← ERRADO: é um array direto
     metadata: "string"                  // ← ERRADO: deve ser objeto JSON
   });
   ```
   
   ✅ CORRETO:
   ```typescript
   await supabase.from('knowledge_base').insert({
     content: texto,
     embedding: [1, 2, 3, ...],  // ← Array direto
     metadata: {                  // ← Objeto JSON
       titulo: "...",
       agente: "...",
       tags: [...]
     }
   });
   ```

3️⃣  SERVICE ROLE KEY ERRADA
   
   ✅ VERIFICAR:
   - Supabase: Settings → API
   - Copie "Service Role Key" (começa com "eyJhbGc")
   - NÃO use "anon key"
   - Atualize .env.local

4️⃣  TABELA NÃO EXISTE
   
   ✅ CRIAR (SQL Editor do Supabase):
   ```sql
   CREATE TABLE IF NOT EXISTS knowledge_base (
     id BIGSERIAL PRIMARY KEY,
     content TEXT NOT NULL,
     embedding vector(768) NOT NULL,
     metadata JSONB,
     created_at TIMESTAMP DEFAULT now(),
     updated_at TIMESTAMP DEFAULT now()
   );
   
   CREATE INDEX knowledge_base_embedding_idx 
   ON knowledge_base USING ivfflat (embedding vector_cosine_ops) 
   WITH (lists = 100);
   ```

─────────────────────────────────────────────────────────────────────────────

## CHECKLIST DE RESOLUÇÃO
─────────────────────────────────────────────────────────────────────────────

ANTES DE RODAR seed-knowledge.ts:

[ ] .env.local está na raiz de C:\Users\Computador\AgendaVet-Surgical-Fix\
[ ] GEMINI_API_KEY começa com "AIzaSy"
[ ] DEEPSEEK_API_KEY (se usar) começa com "sk-"
[ ] KIMI_API_KEY (se usar) começa com "sk-"
[ ] SUPABASE_URL é https://xxxxx.supabase.co
[ ] SUPABASE_SERVICE_ROLE_KEY começa com "eyJhbGc"
[ ] Generative Language API está ATIVADA no Google Cloud
[ ] Tabela knowledge_base existe no Supabase
[ ] Coluna embedding é vector(768)
[ ] .env.local tem LF (não CRLF) - converter no VS Code
[ ] Você executou: npm install (para ter as dependências)

DEPOIS DE PREPARAR:

1. Execute: npx tsx agendavet-diagnostico.ts
   → Deve passar em TODAS as fases

2. Se diagnostico passar, execute: npx tsx seed-knowledge-corrigido.ts
   → Deve salvar com sucesso

3. Se ainda falhar, compartilhe o OUTPUT COMPLETO do erro

─────────────────────────────────────────────────────────────────────────────

## DÚVIDAS FREQUENTES
─────────────────────────────────────────────────────────────────────────────

P: Por que erro 400 no Google mas 401 no DeepSeek?

R: 400 = "seu request está mal formado" (chave inválida, API não ativada)
   401 = "você não tem permissão" (chave expirada, endpoint errado)
   São mensagens diferentes de diferentes serviços.

P: Devo usar Google, DeepSeek ou Kimi?

R: Para COMEÇAR: Google Gemini
   → Gratuito (12.500 requests/mês)
   → Mais confiável
   → Melhor documentação
   
   Depois: DeepSeek
   → Mais barato em production
   → Requer API key paga

P: Posso ter múltiplas chaves?

R: SIM! Coloque todas no .env.local e escolha qual usar:
   ```
   GEMINI_API_KEY=AIzaSy...
   DEEPSEEK_API_KEY=sk-...
   KIMI_API_KEY=sk-...
   ```
   
   Depois escolha no código: seed('google') ou seed('deepseek')

P: Como testar se a chave funciona ANTES de usar no seed?

R: Use o script diagnostico:
   ```bash
   npx tsx agendavet-diagnostico.ts
   ```
   Ele testa cada chave individualmente.

─────────────────────────────────────────────────────────────────────────────

## PRÓXIMOS PASSOS (APÓS RESOLVER)
─────────────────────────────────────────────────────────────────────────────

1. ✅ Fazer seed de 1 protocolo (você está aqui)
2. Expandir para múltiplos protocolos
3. Implementar busca por similaridade (RAG)
4. Criar API para consultar knowledge base
5. Integrar com interface do AgendaVet

═══════════════════════════════════════════════════════════════════════════════
