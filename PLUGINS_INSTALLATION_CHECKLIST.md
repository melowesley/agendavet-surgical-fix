# ✅ Checklist Detalhado de Instalação dos 4 Plugins

## 🎯 Objetivo
Instalar e configurar os 4 plugins Claude Code de forma segura e eficiente no seu ambiente AgendaVet.

---

## 📋 Pré-requisitos (ANTES DE COMEÇAR)

- [ ] Claude Code CLI instalado globalmente
- [ ] Node.js 18+ (`node --version` deve mostrar v18+)
- [ ] npm/yarn instalado (`npm --version`)
- [ ] Git configurado (`git config --list`)
- [ ] Acesso à pasta `/AgendaVet-Surgical-Fix`
- [ ] Browser com 2 abas abertas:
  - [ ] Aba 1: Documentação dos plugins
  - [ ] Aba 2: Console do n8n (se usar n8n)

**Verificar pré-requisitos**:
```bash
# Run these commands in your terminal
node --version        # v18.17.0 ou superior
npm --version         # 9.0.0 ou superior
git config user.name  # Seu nome Git
claude --version      # Deve mostrar versão
```

---

## 🔧 PLUGIN 1: Superpowers

### Fase 1.1: Instalação

- [ ] **Passo 1**: Abra terminal na pasta do projeto
```bash
cd C:\Users\Computador\AgendaVet-Surgical-Fix
```

- [ ] **Passo 2**: Faça login no Claude Code
```bash
claude logout    # Se estiver logado antes
claude login     # Será aberto um browser para autenticação
```

- [ ] **Passo 3**: Instale o plugin Superpowers
```bash
claude plugin install superpowers
```

Expected output:
```
✅ Plugin 'superpowers' instalado com sucesso
   Versão: 1.2.3
   Localização: ~/.claude/plugins/superpowers.plugin
```

- [ ] **Passo 4**: Verifique instalação
```bash
claude plugin list
```

Should list: `superpowers` ✅

### Fase 1.2: Teste Básico

- [ ] **Teste 1**: Análise simples
```
Prompt para Claude:
"Superpowers: Analise o arquivo components/dashboard/dashboard-content.tsx 
e identifique 3 oportunidades de otimização"
```

Expected: Claude responde com análise detalhada de código

- [ ] **Teste 2**: Verificar que funciona
```
Você deve receber:
1. Análise de padrões de código
2. Sugestões específicas com exemplos
3. Estimates de ganho de performance
```

### Fase 1.3: Configuração para AgendaVet

- [ ] **Criar arquivo de config** (opcional mas recomendado)
```bash
mkdir -p ~/.claude/config
cat > ~/.claude/config/superpowers-config.json << 'EOF'
{
  "analysis_depth": "deep",
  "focus_areas": ["performance", "types", "accessibility"],
  "project_type": "nextjs-typescript",
  "output_format": "detailed"
}
EOF
```

- [ ] **Status**: Superpowers ✅ Pronto!

---

## 🔧 PLUGIN 2: n8n-skills

### Fase 2.1: Setup n8n Cloud (Recomendado)

- [ ] **Passo 1**: Criar conta n8n
  - Acesse: https://app.n8n.cloud
  - Clique em "Sign Up"
  - Use email: `seu-email@agendavet.com`
  - Confirme email

- [ ] **Passo 2**: Criar primeiro workflow vazio
  - Clique em "New" → "Workflow"
  - Nomeie: "AgendaVet-Test-Workflow"
  - Salve (ícone de disco)

- [ ] **Passo 3**: Obter API Key
  - Canto superior direito → "Settings"
  - Abas à esquerda → "API Keys"
  - Clique em "Create API Key"
  - Copie a chave (guardar em segurança!)

- [ ] **Passo 4**: Copiar Webhook URL
  - Volte ao workflow vazio
  - Clique em "..." → "Test URL"
  - Copie a URL (para usar depois)

### Fase 2.2: Configurar Credenciais no AgendaVet

- [ ] **Passo 1**: Adicionar ao .env.local
```bash
# Em: C:\Users\Computador\AgendaVet-Surgical-Fix\.env.local
# Adicione estas linhas:

N8N_API_KEY=your_copied_api_key_here
N8N_WEBHOOK_URL=https://webhook.site/your-webhook-id
N8N_ENVIRONMENT=cloud
```

⚠️ **IMPORTANTE**: Não commite .env.local! Já está em .gitignore ✅

- [ ] **Passo 2**: Instalar plugin Claude
```bash
claude plugin install n8n-skills
```

- [ ] **Passo 3**: Verificar instalação
```bash
claude plugin list | grep n8n
```

### Fase 2.3: Primeiro Workflow Automático

- [ ] **Teste**: Criar workflow de teste
```
Prompt para Claude:
"n8n-skills: Crie um workflow simples que:
1. Seja acionado por webhook
2. Receba JSON com: name, email
3. Faça log em console
4. Retorne confirmação

Código do workflow em JSON."
```

Expected: Claude gera workflow JSON pronto para copiar-colar

- [ ] **Status**: n8n-skills ✅ Pronto!

---

## 🔧 PLUGIN 3: get-shit-done

### Fase 3.1: Instalação

- [ ] **Passo 1**: Instalar plugin
```bash
claude plugin install get-shit-done
```

- [ ] **Passo 2**: Verificar
```bash
claude plugin list | grep get-shit-done
```

- [ ] **Passo 3**: Criar arquivo de config (opcional)
```bash
cat > ~/.gsd-config.json << 'EOF'
{
  "projectType": "nextjs",
  "language": "typescript",
  "componentPattern": "function",
  "testFramework": "vitest",
  "cwd": "C:\\Users\\Computador\\AgendaVet-Surgical-Fix"
}
EOF
```

### Fase 3.2: Primeiro Comando

- [ ] **Teste 1**: Criar componente de teste
```bash
gsd component --name "TestComponent" --path "components/test"
```

Expected output:
```
✅ Criando TestComponent...
✅ components/test/test-component.tsx
✅ components/test/test-component.test.tsx
✅ components/test/test-component.types.ts
```

- [ ] **Teste 2**: Listar arquivo criado
```bash
ls components/test/
```

Should show 3 files ✅

- [ ] **Passo 3**: Deletar teste (cleanup)
```bash
rm -r components/test
git checkout components/  # Reverter mudanças
```

- [ ] **Status**: get-shit-done ✅ Pronto!

---

## 🔧 PLUGIN 4: ui-ux-pro-max-skill

### Fase 4.1: Instalação

- [ ] **Passo 1**: Instalar plugin
```bash
claude plugin install ui-ux-pro-max-skill
```

- [ ] **Passo 2**: Verificar componentes Shadcn disponíveis
```bash
npx shadcn-ui@latest list
```

- [ ] **Passo 3**: Instalar dependências (se necessário)
```bash
npm install lucide-react clsx class-variance-authority
```

### Fase 4.2: Teste Básico

- [ ] **Teste**: Sugestão de melhoria
```
Prompt para Claude:
"ui-ux-pro-max-skill: Analise components/dashboard/dashboard-content.tsx
e sugira 3 melhorias de UX para mobile"
```

Expected: Claude fornece sugestões específicas de Tailwind CSS

- [ ] **Status**: ui-ux-pro-max-skill ✅ Pronto!

---

## 🚀 FASE 5: Verificação Completa

### Checklist Final

- [ ] **Todos os 4 plugins instalados**
```bash
claude plugin list
```

Should show:
```
superpowers
n8n-skills
get-shit-done
ui-ux-pro-max-skill
```

- [ ] **Credenciais configuradas no .env.local**
```bash
# Verifique se não é vazio
cat .env.local | grep N8N_
```

- [ ] **Node_modules atualizado**
```bash
npm install
npm run build  # Deve compilar sem erros
```

- [ ] **Git status limpo**
```bash
git status
# Deve mostrar branch atualizada, sem mudanças pendentes
```

- [ ] **Teste integrado dos 4 plugins**
```
Prompt para Claude:
"Vocês 4 plugins juntos: 
1. Superpowers analisa components/dashboard
2. get-shit-done cria um novo componente baseado na análise
3. ui-ux-pro-max-skill otimiza UI
4. n8n-skills configura notificação

Mostre como usariam juntos."
```

---

## ⚠️ Troubleshooting

### Problema: "Plugin not found" ao tentar instalar

**Solução**:
```bash
# 1. Faça logout e login novamente
claude logout
claude login

# 2. Tente instalar novamente
claude plugin install superpowers

# 3. Se ainda não funcionar, verifique conexão internet
ping google.com
```

---

### Problema: Claude não reconhece o plugin após instalação

**Solução**:
```bash
# 1. Reinicie o terminal
exit
# Abra novo terminal

# 2. Verifique instalação
claude plugin list

# 3. Se listado mas não funciona, tente reload
claude plugin reload superpowers
```

---

### Problema: n8n webhook não funciona

**Solução**:
```bash
# 1. Teste a URL diretamente
curl -X POST https://seu-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# 2. Verifique logs em n8n.cloud
# Abra: https://app.n8n.cloud
# Seu workflow → "Execution History"

# 3. Verifique credenciais no .env.local
cat .env.local | grep N8N_
```

---

### Problema: get-shit-done não cria arquivos

**Solução**:
```bash
# 1. Verifique permissões de pasta
ls -la components/

# 2. Tente criar manualmente
mkdir -p components/test

# 3. Tente novamente
gsd component --name "Test" --path "components/test"

# 4. Se erro persiste, use caminho absoluto
gsd component --name "Test" \
  --path "C:/Users/Computador/AgendaVet-Surgical-Fix/components/test"
```

---

## 📝 Documentação Salva no Projeto

- ✅ PLUGINS_INSTALLATION_GUIDE.md (guia completo)
- ✅ PLUGINS_PRACTICAL_EXAMPLES.md (exemplos de uso)
- ✅ PLUGINS_INSTALLATION_CHECKLIST.md (este arquivo)

---

## 🎓 Próximos Passos Após Instalação

**Dia 1** (depois da instalação):
1. Ler PLUGINS_PRACTICAL_EXAMPLES.md
2. Tentar 1 exemplo de cada plugin
3. Documentar learnings

**Dia 2-3**:
1. Combinar plugins em workflow real
2. Criar primeiro componente com get-shit-done
3. Configurar primeira automação n8n

**Dia 4-5**:
1. Otimizar dashboard com ui-ux-pro-max-skill
2. Análise com superpowers
3. Rodar suite de testes
4. Deploy em staging

---

## 💬 Quando Pedir Ajuda

Depois de instalar, você pode me pedir:
- "Execute o workflow n8n para..."
- "Crie um novo componente para..."
- "Otimize o dashboard com..."
- "Analise este código com superpowers..."
- "Combine os plugins para fazer..."

---

## ✅ Checklist Resumido

**ANTES DE COMEÇAR:**
- [ ] Terminal aberto em /AgendaVet-Surgical-Fix
- [ ] Claude CLI funcionando
- [ ] Conexão internet estável

**INSTALAR CADA PLUGIN:**
- [ ] Superpowers → `claude plugin install superpowers`
- [ ] n8n-skills → `claude plugin install n8n-skills` + setup n8n.cloud
- [ ] get-shit-done → `claude plugin install get-shit-done`
- [ ] ui-ux-pro-max-skill → `claude plugin install ui-ux-pro-max-skill`

**TESTAR CADA PLUGIN:**
- [ ] Superpowers → Analisar um componente
- [ ] n8n-skills → Criar primeiro workflow
- [ ] get-shit-done → Criar teste componente
- [ ] ui-ux-pro-max-skill → Sugerir melhoria

**VALIDAR TUDO:**
- [ ] `claude plugin list` mostra 4 plugins
- [ ] `.env.local` tem credenciais n8n
- [ ] Projeto compila sem erros
- [ ] Git status limpo

---

**Última atualização**: 2026-03-19
**Status**: Pronto para usar
**Tempo estimado**: 30-45 minutos por plugin
**Tempo total**: ~2 horas para instalar tudo
