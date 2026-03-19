# 🎯 AgendaVet Skills Router - Guia Completo de Fluxos

## Bem-vindo ao Sistema de Skills!

O AgendaVet agora possui **5 skills poderosos** integrados em um único roteador centralizado (`.skills/router.ts`). Este guia mostra como usá-los para otimizar seu workflow de desenvolvimento.

---

## 📖 Índice

1. [Começar Rápido](#começar-rápido)
2. [5 Skills Explicados](#5-skills-explicados)
3. [Fluxos de Trabalho](#fluxos-de-trabalho)
4. [Detecção Automática](#detecção-automática)
5. [Exemplos Práticos](#exemplos-práticos)
6. [Integração com Vet Copilot](#integração-com-vet-copilot)

---

## 🚀 Começar Rápido

### Três formas de usar:

**1. Comando Explícito**
```
/gsd-plan adicionar autenticação 2FA
```

**2. Descrição Natural (Auto-Detect)**
```
Preciso de um plano para adicionar autenticação 2FA
→ Sistema detecta e ativa /gsd-plan
```

**3. Alias Rápido**
```
/plan adicionar autenticação 2FA
→ Alias resolve para /gsd-plan
```

### Ver Todos os Comandos
```
/help
```

---

## 📦 5 Skills Explicados

### 1️⃣ **get-shit-done** (v1.26.0)
**Framework de desenvolvimento estruturado com 16 subagentes.**

**Quando usar:**
- Criar plano para feature nova
- Debug de bug complexo
- Verificar implementação contra requisitos

**Comandos principais:**
- `/gsd-plan [descrição]` - Plano estruturado
- `/gsd-execute` - Executar com subagentes
- `/gsd-debug [descrição bug]` - Debug sistemático
- `/gsd-verify` - Verificação de requisitos

**Fluxo:** Plan → Execute → Verify

---

### 2️⃣ **ui-ux-pro-max** (v2.0.0)
**Design system generator com 161 padrões.**

**Quando usar:**
- Criar design system consistente
- Auditar UI/UX existente
- Garantir acessibilidade WCAG-AA

**Comandos principais:**
- `/design-system [target]` - Gerar design system automático
- `/ui-audit [caminho]` - Auditoria de UI/UX
- `/ui-validate [componentes]` - Validar componentes

**Output esperado:**
- Paleta de cores (5-7 cores + neutras)
- Tipografia (2-3 Google Fonts)
- 20+ componentes padronizados
- Checklist WCAG-AA

---

### 3️⃣ **n8n-skills** (v1.1.0)
**Referência de padrões robustos (7 skills, 62% cobertura).**

**Quando usar:**
- Aplicar validação robusta
- Implementar error handling
- Implementar padrões arquiteturais

**Comandos principais:**
- `/validation-patterns [tipo]` - 4 perfis de validação
- `/error-handling` - Top 5 padrões de erro
- `/workflow-patterns` - Padrões arquiteturais

**4 Perfis de Validação:**
- `minimal` - required fields only
- `runtime` - type checking + required
- `ai-friendly` - permissivo para IA
- `strict` - máxima validação

---

### 4️⃣ **agent-skills** (v1.0.0)
**React/Next.js best practices + Vercel deploy (6 skills, 64 rules).**

**Quando usar:**
- Review de componentes React
- Otimizar performance/bundle
- Deploy para Vercel

**Comandos principais:**
- `/review-react [componente]` - Review (64 rules)
- `/check-performance` - Bundle + performance
- `/deploy` - Deploy Vercel
- `/check-accessibility` - Acessibilidade

**64 Rules Cobrem:**
- Component patterns
- Performance optimization
- Accessibility
- Code quality

---

### 5️⃣ **superpowers** (v5.0.4)
**Workflow metodologia completo (14 skills) - Brainstorm até Merge.**

**Quando usar:**
- Qualquer feature nova
- Bug fixes estruturados
- Code review workflow

**Comandos principais:**
- `/brainstorm [ideia]` - Refinar em spec
- `/plan-impl [spec]` - Plano fase-por-fase
- `/tdd` - Test-Driven Development (RED-GREEN-REFACTOR)
- `/execute-plan` - Executar com checkpoints
- `/debug-sys [bug]` - Debug 4-phase
- `/code-review-req` - Solicitar review
- `/respond-feedback` - Responder comentários
- `/finish-branch` - Merge/PR

---

## 🔄 Fluxos de Trabalho

### Fluxo 1: Feature Nova Completa ⭐

```
┌─────────────────────────────────────────┐
│ FEATURE NOVA (Superpowers + GSD + UI)   │
└─────────────────────────────────────────┘

1️⃣ /brainstorm [ideia]
   ↓ Refina ideia em spec estruturada

2️⃣ /plan-impl [spec]
   ↓ Quebra em tarefas fase-por-fase

3️⃣ /tdd [primeira task]
   ↓ RED: escreve teste que falha
   ↓ GREEN: escreve código mínimo
   ↓ REFACTOR: melhora código

4️⃣ /execute-plan
   ↓ Próximas tasks com checkpoints

5️⃣ /review-react [componentes novos]
   ↓ Aplica 64 rules de best practices

6️⃣ /design-system [se houver UI nova]
   ↓ Garante consistência visual

7️⃣ /code-review-req
   ↓ Solicita review com checklist automático

8️⃣ /respond-feedback
   ↓ Responde comentários de review

9️⃣ /finish-branch
   ↓ Cria PR e faz merge
```

---

### Fluxo 2: Bug Fix com Root Cause ⚙️

```
┌──────────────────────────────────────┐
│ BUG FIX (Superpowers + N8N)          │
└──────────────────────────────────────┘

1️⃣ /debug-sys [descrição do bug]
   ↓ Phase 1: OBSERVE - Reproduzir bug
   ↓ Phase 2: HYPOTHESIZE - Possíveis causas
   ↓ Phase 3: TEST - Testar hipóteses
   ↓ Phase 4: FIX - Implementar solução

2️⃣ /validation-patterns [tipo de erro]
   ↓ Aplicar validação robusta
   ↓ Evitar regressão

3️⃣ /tdd [fix]
   ↓ Escrever teste que falha
   ↓ Implementar fix
   ↓ Teste passar

4️⃣ /verify-fix
   ↓ Confirmar que bug foi resolvido
   ↓ Testar edge cases

5️⃣ /code-review-req
   ↓ Solicitar review

6️⃣ /finish-branch
   ↓ Merge
```

---

### Fluxo 3: Otimização React/Performance 🚀

```
┌──────────────────────────────────────┐
│ OTIMIZAÇÃO (Agent-Skills)            │
└──────────────────────────────────────┘

1️⃣ /review-react [componentes]
   ↓ Aplica 64 best practice rules
   ↓ Identifica problemas

2️⃣ /check-performance
   ↓ Mede bundle size
   ↓ Analisa load time
   ↓ Lighthouse score

3️⃣ /tdd [otimizações]
   ↓ Escrever testes para novas otimizações

4️⃣ /deploy
   ↓ Deploy para Vercel
   ↓ Verify performance gains
```

---

### Fluxo 4: Melhoria Visual Completa 🎨

```
┌──────────────────────────────────────┐
│ DESIGN SYSTEM (UI/UX Pro Max)        │
└──────────────────────────────────────┘

1️⃣ /ui-audit [caminho]
   ↓ Auditoria atual
   ↓ Identifica inconsistências
   ↓ Problemas de acessibilidade

2️⃣ /design-system [target]
   ↓ Gera design system automático
   ↓ Paleta de cores
   ↓ Tipografia
   ↓ Componentes

3️⃣ /review-react [componentes UI]
   ↓ Validar implementação do design

4️⃣ /verify-fix
   ↓ Confirmar consistência

5️⃣ /deploy
   ↓ Deploy ao design system
```

---

## 🤖 Detecção Automática

O sistema detecta automaticamente qual skill usar baseado em **keywords** na sua mensagem.

### Keywords por Skill:

| Skill | Keywords | Exemplo |
|-------|----------|---------|
| gsd-plan | plan, vou, preciso, fazer, feature | "Vou adicionar notificações" |
| gsd-debug | bug, erro, não funciona, quebrou | "Tem um bug na dosagem" |
| design-system | design, cores, ui, ux, visual | "Melhorar UI do Vet Copilot" |
| deploy | deploy, produção, vercel, publicar | "Deploy para produção" |
| brainstorm | brainstorm, ideia, spec, requirements | "Como você faria esse recurso?" |
| tdd | tdd, teste, code, implementar | "Implementar com testes" |
| debug-sys | debug, bug, erro, problema, falha | "Debug esse erro" |
| code-review | review, código, feedback, check | "Review meu código" |

### Como Funciona:

```
Você: Preciso adicionar autenticação 2FA
     ↓
Sistema detecta: "preciso", "adicionar", "feature"
     ↓
Matches: gsd-plan
     ↓
🤖 Detectado: /gsd-plan
Ativando skill...
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Feature Simples

```
Você: Vou adicionar um botão de export em analytics

🤖 Sistema detecta: /gsd-plan

Plano gerado:
─────────────────────────────────────
Fase 1: Análise de requisitos
  - Que formato de export? (CSV, PDF, Excel)
  - Onde colocar botão?
  - Quais dados exportar?

Fase 2: Design
  - Design do botão
  - Localização em UI

Fase 3: Implementação
  - Backend: endpoint de export
  - Frontend: button + handler
  - Validações

Fase 4: Testes
  - Unit tests
  - E2E tests
  - Testes de acessibilidade

Fase 5: Review & Deploy
  - Code review
  - Deploy preview
─────────────────────────────────────

Você: Segue com o plano

Sistema: /gsd-execute ativado
Despachando subagentes...
```

### Exemplo 2: Bug Complexo

```
Você: A dosagem está errada para gatos obesos

🤖 Sistema detecta: /debug-sys

Debug 4-Phase iniciado:

Phase 1: OBSERVE
─────────────────────────────────────
Reproduzindo bug:
- Gato: Persa, 8kg, obeso
- Medicação: Amoxicilina
- Dose calculada: 125mg (ERRADA)
- Dose esperada: 250mg
─────────────────────────────────────

Phase 2: HYPOTHESIZE
─────────────────────────────────────
Possíveis causas:
1. Cálculo de peso incorreto (mais provável)
2. Multiplicador de dose errado para obesos
3. Truncamento de decimais
─────────────────────────────────────

Phase 3: TEST
─────────────────────────────────────
Testando hipótese 1:
  weight = 8kg ✓
  dose_per_kg = 31.25 (125/4) ✗

Esperado: 50mg/kg para gatos = 400mg total
Dividido por 3 doses = 133mg/dose
Mas para obesos = 250mg/dose

Hipótese 1: CONFIRMADA ✓
─────────────────────────────────────

Phase 4: FIX
─────────────────────────────────────
Problema identificado:
calculateDosage não considera obesity_factor

Fix implementado:
dosage = weight * dose_per_kg * obesity_factor
─────────────────────────────────────

Você: Ok, escreve o teste e fix

Sistema: /tdd ativado
```

### Exemplo 3: Melhorar UI do Vet Copilot

```
Você: A UI do Vet Copilot está inconsistente

🤖 Sistema detecta: /ui-audit

Auditoria Completa:
─────────────────────────────────────
Cores:
❌ 5 shades diferentes de azul (deve ser 1 paleta)
❌ Botões: 3 cores diferentes de verde
✓ Backgrounds consistentes

Tipografia:
❌ H2 font-size varia: 18px vs 20px
❌ Body font: Mix de Inter, Roboto, sans-serif
✓ Line heights boas

Acessibilidade:
⚠️ Form label contrast: 4.2:1 (precisar 4.5:1)
⚠️ Button minimum height: 40px (ok) mas 1 botão: 35px
✓ Keyboard navigation OK

Responsividade:
⚠️ Chat container quebra em 375px
✓ Modal OK em mobile
─────────────────────────────────────

Você: Arruma tudo

Sistema: /design-system ativado

Gerando Design System para Healthcare:
─────────────────────────────────────
Cores Recomendadas:
- Primary: #2D5016 (verde clínico)
- Secondary: #A8D5BA
- Accent: #D4AF37

Tipografia:
- Sans: Inter
- Serif: Merriweather

Componentes:
- Button (4 variants)
- Input (com validação)
- Card
- Modal
- Alert
- Badge
─────────────────────────────────────

Aplicando design system...
✓ Colors updated
✓ Typography normalized
✓ Components refactored
✓ Acessibilidade check: OK
✓ Responsividade: OK
```

---

## 🏥 Integração com Vet Copilot

O skill router melhora especificamente o **Vet Copilot** através de:

### 1. Design System Consistente
```
/design-system vet-copilot
↓ Gera paleta healthcare-specific
↓ Tipografia profissional
↓ Componentes clínicos
```

### 2. Validação Robusta
```
/validation-patterns vet-copilot
↓ Aplica 4 perfis (minimal, runtime, ai-friendly, strict)
↓ Sanitiza inputs (prompt injection)
↓ Valida outputs (antes de BD)
```

### 3. Error Handling Top 5
```
/error-handling
↓ Type mismatch → type checking automático
↓ Null/undefined → null-checks em todos tools
↓ Rate limiting → quota check melhorado
↓ Timeout → retry com backoff
↓ External API → fallback strategy
```

### 4. Planejamento de Expansões
```
/gsd-plan adicionar [nova feature ao Vet Copilot]
↓ Planejamento estruturado
↓ Phases e requisitos
↓ Verificação antes de código
```

---

## 🎓 Quick Reference

### Aliases Mais Comuns
```
/plan           → /gsd-plan
/execute        → /gsd-execute
/debug          → /gsd-debug
/design         → /design-system
/deploy         → /deploy
/code-review    → /code-review-req
/branch         → /worktree
/merge          → /finish-branch
```

### Fluxos Rápidos
```
Feature    → /brainstorm → /plan-impl → /tdd → /execute-plan
Bug        → /debug-sys → /validate → /tdd fix → /verify
Otimizar   → /review-react → /check-performance → /deploy
UI         → /ui-audit → /design-system → /verify
```

---

## 📞 Suporte

- Ver todos os comandos: `/help`
- Documentação skills: `.skills/README.md`
- Roadmap: Ver `.claude/plans/` para planos de features

---

**Desenvolvido para otimizar AgendaVet com 5 skills poderosos integrados! 🚀**
