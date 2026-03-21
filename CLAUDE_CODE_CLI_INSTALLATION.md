# 🚀 INSTALAR CLAUDE CODE CLI NO WINDOWS

**Objetivo**: Instalar Claude Code CLI para poder usar os 4 plugins localmente no seu PC.

---

## 📋 PRÉ-REQUISITOS

Você já tem:
- ✅ Node.js 18+ (você confirmou)
- ✅ npm (vem com Node.js)
- ✅ Windows 10/11

---

## 🎯 PASSO 1: VERIFICAR NODE.JS E NPM

Abra **Terminal (CMD ou PowerShell)** e execute:

```bash
node --version
npm --version
```

**Esperado**:
```
v18.17.0 (ou superior)
9.0.0 (ou superior)
```

Se não funcionar, reinstale Node.js de: https://nodejs.org

---

## 🎯 PASSO 2: INSTALAR CLAUDE CODE CLI

### Opção A: Via NPX (Recomendado - Sem Instalar Globalmente)

**Abra CMD/PowerShell e execute:**

```bash
npx @anthropic-ai/claude@latest
```

Isso vai:
1. Fazer download do Claude Code CLI
2. Executar automaticamente
3. Pedir para fazer login
4. Instalado! ✅

---

### Opção B: Via NPM Global (Alternativa)

**Se a Opção A não funcionar:**

```bash
npm install -g @anthropic-ai/claude
```

Depois:

```bash
claude --version
```

---

## 🎯 PASSO 3: FAZER LOGIN

Depois de instalar, execute:

```bash
claude login
```

**O que vai acontecer:**
1. Abre um browser automaticamente
2. Pede para você fazer login em claude.ai
3. Copie o token exibido
4. Cole no terminal
5. Autenticado! ✅

---

## 🎯 PASSO 4: VERIFICAR INSTALAÇÃO

```bash
claude --version
```

**Esperado**: Número da versão (ex: `1.2.3`)

---

## 🎯 PASSO 5: AGORA INSTALAR OS 4 PLUGINS

Depois que Claude CLI está instalado, abra **novo terminal** e execute:

### Plugin 1: Superpowers
```bash
claude plugin install superpowers
```

### Plugin 2: n8n-skills
```bash
claude plugin install n8n-skills
```

### Plugin 3: get-shit-done
```bash
claude plugin install get-shit-done
```

### Plugin 4: ui-ux-pro-max-skill
```bash
claude plugin install ui-ux-pro-max-skill
```

---

## ✅ VERIFICAR TODOS OS PLUGINS INSTALADOS

```bash
claude plugin list
```

**Esperado**:
```
superpowers ✅
n8n-skills ✅
get-shit-done ✅
ui-ux-pro-max-skill ✅
```

---

## 🎯 PASSO 6: USAR OS PLUGINS

Agora você pode usar os plugins em 2 formas:

### Forma 1: Via Claude.ai Web
- Acesse https://claude.ai
- Faça login
- Use os prompts dos plugins normalmente
- Os plugins funcionam automaticamente

### Forma 2: Via Claude Code CLI (Linha de Comando)
```bash
claude code --help
```

---

## ⚠️ TROUBLESHOOTING

### Problema 1: "npx: command not found"

**Solução**: Node.js não está no PATH

1. Desinstale Node.js
2. Reinstale de https://nodejs.org (versão LTS)
3. Reinicie o PC
4. Tente novamente

---

### Problema 2: "npm ERR! 404"

**Solução**: O pacote não existe com esse nome

Tente:
```bash
npx @anthropic-ai/claude@latest
```

Ou acesse o site oficial para instruções atualizadas:
https://claude.ai/claude-code

---

### Problema 3: Login não funciona

**Solução**:
1. Faça logout: `claude logout`
2. Faça login novamente: `claude login`
3. Siga as instruções no browser

---

### Problema 4: Plugin install falha

**Solução**:
1. Verifique conexão internet
2. Tente novamente
3. Se não funcionar, reporte em https://github.com/anthropics/claude-code

---

## 📊 RESUMO DA INSTALAÇÃO

```
1. Verificar Node.js ✓
2. Instalar Claude CLI ← VOCÊ AQUI
3. Fazer login
4. Instalar 4 plugins
5. Testar plugins
6. Usar em AgendaVet ✓
```

---

## 🎯 PRÓXIMOS PASSOS APÓS INSTALAÇÃO

Depois que tudo estiver instalado:

1. **Acesse**: https://claude.ai
2. **Faça login** com sua conta
3. **Use os prompts** do documento `PLUGINS_TEST_PROMPTS.md`
4. **Teste cada plugin** com exemplos do AgendaVet
5. **Comece a usar** em produção!

---

## 📞 ONDE ENCONTRAR AJUDA

- **Documentação Claude Code**: https://claude.ai/claude-code
- **Suporte Anthropic**: https://support.anthropic.com
- **GitHub Issues**: https://github.com/anthropics/claude-code/issues

---

**Status**: 📝 Instruções completas
**Tempo estimado**: 5-10 minutos
**Próximo passo**: Execute o Passo 1 acima!

Melo, é só seguir passo-a-passo e vai funcionar! 💪
