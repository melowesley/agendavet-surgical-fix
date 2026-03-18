╔════════════════════════════════════════════════════════════════════════════════╗
║                   GUIA PRÁTICO - AGENDAVET                                   ║
║              Passo a Passo para Resolver os Problemas 400/401                ║
╚════════════════════════════════════════════════════════════════════════════════╝

## 🎯 RESUMO EXECUTIVO

Você tem dois problemas principais:
1. ❌ Erro 400 no Google Gemini (chave inválida ou API não ativada)
2. ❌ Erro 401 no DeepSeek/Kimi (provavelmente usando chave Google ao invés da correcta)

**Solução: Usar APENAS Google Gemini (mais confiável e gratuito)**

═══════════════════════════════════════════════════════════════════════════════

## PASSO 1️⃣: PREPARAR O AMBIENTE

### 1.1 - Verificar se o projeto está na raiz correta

📁 Estrutura esperada:
```
C:\Users\Computador\AgendaVet-Surgical-Fix\
├── .env.local                    ← Seu arquivo de variáveis
├── seed-knowledge.ts             ← Script de seed
├── package.json
├── node_modules\
└── ...
```

### 1.2 - Copiar os arquivos corrigidos

Cole estes arquivos na raiz do seu projeto:

✅ **seed-knowledge-corrigido.ts** — Script principal (copie como seed-knowledge.ts)
✅ **agendavet-diagnostico.ts** — Script de diagnóstico
✅ **env-validator.ts** — Validador de variáveis
✅ **TROUBLESHOOTING-AGENDAVET.md** — Este guia

### 1.3 - Verificar se você tem as dependências

Execute no PowerShell (na raiz do projeto):

```powershell
npm list @google/generative-ai
npm list @supabase/supabase-js
npm list dotenv
```

Se não tiver, instale:

```powershell
npm install @google/generative-ai @supabase/supabase-js dotenv
npm install --save-dev typescript @types/node tsx
```

═══════════════════════════════════════════════════════════════════════════════

## PASSO 2️⃣: CORRIGIR O .env.local

### 2.1 - Abrir o arquivo

Abra C:\Users\Computador\AgendaVet-Surgical-Fix\.env.local com VS Code

### 2.2 - Verificar o encoding

⚠️ CRÍTICO para Windows:

1. Clique no canto inferior direito do VS Code (onde diz "CRLF")
2. Selecione "LF" (não CRLF)
3. Salve (Ctrl+S)

✅ Isso remove caracteres invisíveis do Windows que causam erro 400

### 2.3 - Verificar as variáveis

Seu .env.local deve ter EXATAMENTE:

```
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

Não deve ter:
```
GOOGLE_API_KEY=...          ← Errado (usar GEMINI_API_KEY)
DEEPSEEK_API_KEY=...        ← Remova por enquanto
KIMI_API_KEY=...            ← Remova por enquanto
```

✅ Salve novamente (Ctrl+S)

═══════════════════════════════════════════════════════════════════════════════

## PASSO 3️⃣: VALIDAR GOOGLE CLOUD

### 3.1 - Confirmar que API está ativada

1. Vá para: https://console.cloud.google.com/apis/library
2. Pesquise: "Generative Language API"
3. Clique no resultado
4. No topo, certifique-se de que seu projeto "agendavet-487822" está selecionado
5. Clique em "ATIVAR" (se não estiver ativo)
6. Aguarde 30 segundos

✅ Pronto

### 3.2 - Verificar as restrições da chave

1. Vá para: https://console.cloud.google.com/apis/credentials
2. Clique na sua chave (começa com AIzaSy)
3. Scroll down até "Restrições de chave"
4. Mudar para "API HTTP referrers (web sites)"
5. Clique "SALVAR"

✅ Pronto

═══════════════════════════════════════════════════════════════════════════════

## PASSO 4️⃣: EXECUTAR O DIAGNÓSTICO

No PowerShell (na raiz do projeto):

```powershell
npx tsx env-validator.ts
```

Este script vai verificar:
✅ Se .env.local existe
✅ Se as variáveis estão limpas (sem caracteres invisíveis)
✅ Se as chaves têm o formato correto

Resultado esperado:
```
═══════════════════════════════════════════
✅ GEMINI_API_KEY - Válida
✅ NEXT_PUBLIC_SUPABASE_URL - Válida
✅ SUPABASE_SERVICE_ROLE_KEY - Válida

✅ TUDO VÁLIDO! Você pode executar seed-knowledge.ts
```

Se receber ❌, siga as dicas que aparecerem

═══════════════════════════════════════════════════════════════════════════════

## PASSO 5️⃣: EXECUTAR O SEED

### 5.1 - Primeira execução (teste)

```powershell
npx tsx seed-knowledge-corrigido.ts
```

Você deve ver:

```
═════════════════════════════════════════════════════════════════
              SEED KNOWLEDGE BASE - AGENDAVET
                  Agente: GOOGLE
═════════════════════════════════════════════════════════════════

🔗 Testando conexão com Supabase...
   ✅ Supabase conectado com sucesso!

🚀 Gerando embedding com GOOGLE...
   → Inicializando GoogleGenerativeAI...
   → Gerando embedding (text-embedding-004)...
   ✅ Embedding gerado: 768 dimensões

📤 Salvando no Supabase...
   ✅ Protocolo salvo com sucesso!

═════════════════════════════════════════════════════════════════
                    ✅ SUCESSO COMPLETO!
═════════════════════════════════════════════════════════════════

📊 Resumo:
   • Agente: GOOGLE
   • Embedding: 768 dimensões
   • Protocolo: "Protocolo de Tratamento de Otite em Cães"
   • Status: ✅ Salvo no Supabase
```

✅ Se você vê isto, PARABÉNS! O problema foi resolvido!

### 5.2 - Se receber erro

Se receber erro 400:
```
❌ Erro ao gerar embedding: API key not valid
```

Revise:
1. Google Cloud - Generative Language API está ATIVADA?
2. .env.local - Está em LF (não CRLF)?
3. Chave - Começa com "AIzaSy"?

Se receber erro 401:
```
❌ Erro crítico ao salvar: Unauthorized
```

Revise:
1. SUPABASE_SERVICE_ROLE_KEY está correta?
2. Tabela knowledge_base existe no Supabase?

═══════════════════════════════════════════════════════════════════════════════

## PASSO 6️⃣: PRÓXIMAS ETAPAS (DEPOIS DE RESOLVER)

### 6.1 - Adicionar mais protocolos

Edite seed-knowledge.ts e adicione mais protocolos no array:

```typescript
const PROTOCOLO_TESTE = [
  {
    title: 'Protocolo 1',
    content: 'Conteúdo...',
    category: 'cirurgia',
    tags: ['tag1', 'tag2']
  },
  {
    title: 'Protocolo 2',
    content: 'Conteúdo...',
    category: 'farmacologia',
    tags: ['tag3', 'tag4']
  },
  // ... adicione quantos quiser
];
```

### 6.2 - Implementar busca vetorial

Crie um novo arquivo search-protocols.ts:

```typescript
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function buscarProtocolosSimilares(pergunta: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  
  // Gerar embedding da pergunta
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(pergunta);
  const embedding = result.embedding.values;
  
  // Buscar protocolos similares
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  
  const { data: protocolos } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: 3,
  });
  
  return protocolos;
}
```

═══════════════════════════════════════════════════════════════════════════════

## 🚨 TROUBLESHOOTING RÁPIDO

| Erro | Causa | Solução |
|------|-------|---------|
| `Error: GEMINI_API_KEY não encontrada` | Variável não está no .env.local | Adicione: `GEMINI_API_KEY=AIzaSy...` |
| `400 Bad Request - API key not valid` | Generative Language API não ativada | Ativar em Google Cloud Console |
| `401 Authentication Fails` | Usando chave errada | Use NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY |
| `CRLF na variável` | Encoding Windows incorreto | Converter para LF no VS Code |
| `Tabela não encontrada` | knowledge_base não existe no Supabase | Executar SQL no Supabase |

═══════════════════════════════════════════════════════════════════════════════

## 📱 SUPORTE RÁPIDO

Se ainda tiver problemas:

1. Execute e compartilhe o output:
   ```powershell
   npx tsx env-validator.ts
   npx tsx agendavet-diagnostico.ts
   ```

2. Verifique:
   - [ ] Google Cloud: API está ativada?
   - [ ] .env.local: está em LF?
   - [ ] Chaves: começam com prefixos corretos?
   - [ ] Supabase: tabela knowledge_base existe?

3. Se ainda não funcionar, revise o arquivo:
   **TROUBLESHOOTING-AGENDAVET.md**

═══════════════════════════════════════════════════════════════════════════════

## ✅ CHECKLIST FINAL

Antes de considerar "resolvido":

- [ ] npm install funcionou sem erros
- [ ] .env.local está em LF (não CRLF)
- [ ] Google Cloud: Generative Language API ativada
- [ ] env-validator.ts retorna "TUDO VÁLIDO"
- [ ] seed-knowledge-corrigido.ts executa com sucesso
- [ ] Supabase mostra 1 protocolo na tabela knowledge_base
- [ ] Embedding tem exatamente 768 dimensões
- [ ] Metadata foi salva corretamente

═══════════════════════════════════════════════════════════════════════════════

Boa sorte! 🚀
