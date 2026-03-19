# 🚀 AgendaVet Skills Router v1.0.0

Sistema centralizado que integra **5 skills poderosos** (40+ comandos) para otimizar e acelerar desenvolvimento do AgendaVet.

## 📦 Skills Integrados

### 1. **get-shit-done** (v1.26.0)
Meta-framework para desenvolvimento estruturado com 16 subagentes.
- `/gsd-plan` - Criar plano estruturado
- `/gsd-execute` - Executar com subagentes
- `/gsd-debug` - Debug sistemático
- `/gsd-verify` - Verificação de requisitos

### 2. **ui-ux-pro-max** (v2.0.0)
Design system generator com 161 padrões e 8 skills.
- `/design-system` - Gerar design system automático
- `/ui-audit` - Auditoria de UI/UX
- `/ui-validate` - Validar componentes

### 3. **n8n-skills** (v1.1.0)
Referência de padrões robustos (7 skills, 62% de cobertura).
- `/validation-patterns` - 4 perfis de validação
- `/error-handling` - Top 5 padrões de erro
- `/workflow-patterns` - Padrões arquiteturais

### 4. **agent-skills** (v1.0.0)
React/Next.js best practices + Vercel deploy (6 skills, 64 rules).
- `/deploy` - Deploy para Vercel
- `/review-react` - Review componentes React
- `/check-performance` - Performance e bundle

### 5. **superpowers** (v5.0.4)
Workflow metodologia completo (14 skills).
- `/brainstorm` - Refinar ideias
- `/plan-impl` - Plano de implementação
- `/tdd` - Test-Driven Development
- `/execute-plan` - Executar com checkpoints
- `/debug-sys` - Debug 4-phase
- `/code-review-req` - Solicitar review
- `/worktree` - Git worktree
- `/finish-branch` - Merge/PR

---

## 🎯 Como Usar

### Opção 1: Comandos Explícitos

Use comandos diretos com `/`:

```bash
# Criar plano
/gsd-plan adicionar autenticação 2FA

# Gerar design system
/design-system para veterinária

# Deploy
/deploy

# Code review
/code-review-req
```

### Opção 2: Detecção Automática

Descreva o que quer, sistema detecta automaticamente:

```
Você: Preciso adicionar uma feature de notificações
Sistema: 🤖 Detectei planejamento → ativando /gsd-plan
```

### Opção 3: Mix (Recomendado)

Use comando explícito OU descrição natural:

```
/gsd-plan para dashboard de relatórios
OU
Vou criar um dashboard de relatórios, como você recomenda?
```

---

## 📊 Fluxos de Trabalho

### Feature Nova (Superpowers + GSD)

```
/brainstorm [ideia]      → Refinar em spec
↓ (você aprova)
/plan-impl [spec]        → Plano fase-por-fase
↓
/tdd [primeira task]     → Escrever com TDD
↓
/execute-plan            → Próximas tasks
↓
/code-review-req         → Solicitar review
↓
/respond-feedback        → Responder comentários
↓
/finish-branch           → Merge
```

### Bug Fix (Superpowers + N8N)

```
/debug-sys [bug]         → Root cause analysis
↓
/validate [padrão]       → Aplicar validação
↓
/tdd [fix]               → Escrever teste + fix
↓
/verify-fix              → Confirmar resolvido
```

### Otimização React (Agent-Skills)

```
/review-react [componente]  → Review (64 rules)
↓
/check-performance          → Bundle + performance
↓
/deploy                     → Deploy Vercel
```

### Melhoria Visual (UI/UX Pro Max)

```
/ui-audit [caminho]      → Auditoria atual
↓
/design-system           → Gerar system design
↓
/verify-fix              → Confirmar consistência
```

---

## 🎓 Exemplos Práticos

### Exemplo 1: Implementar Feature Simples

```
Você: Preciso adicionar um botão de export em analytics
Sistema: 🤖 Detectei planejamento → /gsd-plan

Plano gerado:
Fase 1: Análise de requisitos
Fase 2: Design do botão
Fase 3: Implementação com TDD
Fase 4: Testes
Fase 5: Review e deploy

Você: Segue

Sistema: Executando /gsd-execute com subagentes...
```

### Exemplo 2: Debug de Bug

```
Você: A dosagem não calcula certo para gatos
Sistema: 🤖 Detectei bug → /debug-sys

Debug 4-Phase:
1. OBSERVE: Reproduzir com gatos
2. HYPOTHESIZE: Possíveis causas
3. TEST: Testar hipóteses
4. FIX: Implementar

Você: Ok, qual é a causa?
Sistema: [análise], agora vou /tdd o fix...
```

### Exemplo 3: Otimizar Vet Copilot UI

```
Você: Mel horar a UI do Vet Copilot
Sistema: 🤖 Detectei UI/UX → /ui-audit

Resultados da auditoria:
- Cores inconsistentes em 5 lugares
- Tipografia não uniforme
- 2 componentes com contraste baixo
- Falta acessibilidade em forms

Você: Arruma isso
Sistema: /design-system ativado...
Gerando design system healthcare...
Tokens CSS criados, componentes atualizados
```

---

## 🔄 Keywords de Auto-Detect

O sistema detecta automaticamente baseado em keywords:

| Skill | Keywords |
|-------|----------|
| **gsd-plan** | plan, vou, preciso, fazer, feature, como fazer |
| **gsd-debug** | bug, erro, não funciona, quebrou, problema |
| **design-system** | design, cores, ui, ux, visual, estilo |
| **deploy** | deploy, produção, vercel, push, publicar |
| **brainstorm** | brainstorm, ideia, pensar, spec, requirements |
| **tdd** | tdd, teste, code, implementar, write |
| **debug-sys** | debug, bug, erro, problema, falha |
| **code-review** | review, código, feedback, check |

---

## 📝 Aliases Disponíveis

Atalhos para comandos frequentes:

```
plan → /gsd-plan
debug → /gsd-debug
verify → /gsd-verify
design → /design-system
audit → /ui-audit
validate → /validation-patterns
errors → /error-handling
deploy → /deploy
review → /review-react
perf → /check-performance
brainstorm → /brainstorm
tdd → /tdd
code-review → /code-review-req
branch → /worktree
merge → /finish-branch
```

---

## 🛠️ Configuração

**Arquivo:** `.skills/router.json`
- Mapeamento de comandos
- Aliases
- Configuração de skills
- Keywords de auto-detect

**Arquivo:** `.skills/router.ts`
- Implementação do roteador
- 40+ comandos registrados
- Detecção automática de intent
- Handlers de execução

**Arquivo:** `.skills/cli.ts`
- CLI wrapper
- Auto-detect ou comando explícito
- Help e documentação

---

## 📚 Mais Informações

Veja `.claude/SKILLS.md` para:
- Fluxos de trabalho detalhados
- Exemplos práticos
- Integração com Vet Copilot
- Roadmap de uso

---

## 💡 Tips & Tricks

1. **Use `/help` para listar todos os comandos**
   ```
   /help
   ```

2. **Combine skills para workflows poderosos**
   ```
   /brainstorm → /plan-impl → /tdd → /execute-plan
   ```

3. **Auto-detect aprende com o tempo**
   - Quanto mais você usa, melhor fica a detecção

4. **Salve fluxos favoritos**
   - Documente workflows comuns em `.claude/SKILLS.md`

5. **Customize aliases**
   - Adicione aliases frequentes em `router.json`

---

## 🚀 Status

✅ 5 skills integrados
✅ 40+ comandos registrados
✅ Detecção automática funcionando
✅ Pronto para uso em AgendaVet

Desenvolvido como parte do projeto AgendaVet para otimizar workflow de desenvolvimento.
