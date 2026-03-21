# 💡 Exemplos Práticos dos 4 Plugins no AgendaVet

## Índice
1. [Superpowers - Exemplos de Uso](#superpowers)
2. [n8n-skills - Exemplos de Automação](#n8n-skills)
3. [get-shit-done - Exemplos de Produtividade](#get-shit-done)
4. [ui-ux-pro-max-skill - Exemplos de Design](#ui-ux-pro-max-skill)
5. [Workflows Combinados](#workflows-combinados)

---

## <a name="superpowers"></a>🔥 Plugin 1: Superpowers - Exemplos de Uso

### Exemplo 1: Análise de Padrões de Arquitetura

**Situação**: Você quer entender como os 17 módulos clínicos estão organizados

**Prompt para Claude**:
```
Superpowers: Analise a arquitetura de /components e identifique:
1. Padrões de código repetidos
2. Componentes que poderiam ser consolidados
3. Hooks customizados que poderiam ser reutilizados
4. Oportunidades de otimização de performance

Focar em: vet-copilot, medical-records, appointments
```

**O que você recebe**:
```
Análise Completa:

PADRÕES REPETIDOS ENCONTRADOS:
- useEffect + useState para data fetching (aparece 12x)
  → Consolidar em hook customizado: useDataFetch()
  
- Mesmo padrão de loading em 8 componentes
  → Criar componente: <LoadingSpinner/>

COMPONENTES A CONSOLIDAR:
- calendar/week-view.tsx + calendar/month-view.tsx
  → Unificar em <CalendarView type="week|month"/>

OTIMIZAÇÕES:
- vet-copilot-content.tsx: 3.2KB → 2.1KB com React.memo
- medical-records-list.tsx: renderiza 500 items, usar virtualization

HOOKS REUTILIZÁVEIS:
- useAppointmentFilters (usado em 4 lugares)
- usePatientData (usado em 6 lugares)
```

---

### Exemplo 2: Refatoração com Segurança de Tipos

**Situação**: Você quer refatorar o vet-copilot mantendo 100% de type safety

**Prompt para Claude**:
```
Superpowers: Refatore components/vet-copilot/vet-copilot-content.tsx:
1. Remova os 'as any' casts
2. Defina interfaces específicas para cada AI model
3. Crie um type guard para validar respostas de IA
4. Adicione JSDoc para cada função

Manter funcionalidade idêntica, zero breaking changes.
```

**Resultado esperado**:
```typescript
// ANTES (com problemas de tipo)
const response = await callAI(model) as any
const result = response.data.content[0]

// DEPOIS (type-safe)
interface AIResponse {
  data: {
    content: string[]
    usage: { tokens: number }
  }
}

function isValidAIResponse(data: unknown): data is AIResponse {
  return typeof data === 'object' && data !== null && 'data' in data
}

const response = await callAI(model)
if (isValidAIResponse(response)) {
  const result = response.data.content[0]
}
```

---

### Exemplo 3: Documentação Automática de APIs

**Situação**: Você quer gerar documentação para as funções do Supabase data-store

**Prompt para Claude**:
```
Superpowers: Gere documentação JSDoc e markdown para:
- lib/data-store.ts (todos os hooks)
- lib/types.ts (todas as interfaces)
- lib/supabase-client.ts (funções de query)

Inclua:
1. Descrição clara
2. Parâmetros com tipos
3. Retorno
4. Exemplos de uso
5. Casos de erro
```

**Exemplo de output**:
```typescript
/**
 * Hook para buscar e gerenciar dados de pets
 * @hook
 * 
 * @returns {Object} Objeto com dados e estado
 * @returns {Pet[]} pets - Lista de todos os pets
 * @returns {boolean} isLoading - Status de carregamento
 * @returns {Error|null} error - Erro se houver
 * @returns {Function} refetch - Função para recarregar dados
 * 
 * @example
 * const { pets, isLoading } = usePets()
 * 
 * @throws {Error} Se query ao Supabase falhar
 */
export function usePets() { ... }
```

---

## <a name="n8n-skills"></a>⚙️ Plugin 2: n8n-skills - Exemplos de Automação

### Exemplo 1: Workflow de Lembretes de Consulta

**Situação**: Tutores esquecem das consultas, você quer automatizar lembretes

**Workflow n8n - Passos**:

```
1. TRIGGER: Novo agendamento criado (via webhook Supabase)
   ↓
2. QUERY DATABASE: SELECT * FROM appointments WHERE date = tomorrow
   ↓
3. LOOP: Para cada agendamento
   ├─ Query owner info
   ├─ Formatar mensagem personalizada
   ├─ Enviar SMS via Twilio
   ├─ Enviar Email via SendGrid
   └─ Log no Supabase (tabela: notifications)
   ↓
4. SAVE: Salvar status de notificação
   ↓
5. SLACK: Notificar vet sobre lembretes enviados
```

**Prompt para Claude**:
```
n8n-skills: Crie um workflow que:
1. Dispare diariamente às 18:00
2. Busque agendamentos de amanhã no Supabase
3. Para cada agendamento:
   - Busque dados do tutor
   - Envie SMS: "Olá {nome}, sua consulta é amanhã às {horario}"
   - Envie Email com detalhes da consulta
   - Salve log de envio
4. Ao final, notifique no Slack os resultados

Incluir tratamento de erro para números de celular inválidos.
```

**Webhook JSON de entrada**:
```json
{
  "appointmentId": "apt_12345",
  "petName": "Rex",
  "ownerId": "own_67890",
  "date": "2026-03-20",
  "time": "10:00"
}
```

---

### Exemplo 2: Sincronização com Google Calendar

**Situação**: Vet quer ver agendamentos do AgendaVet no Google Calendar pessoal

**Workflow n8n**:

```
TRIGGER: Agendamento criado/modificado no AgendaVet
  ↓
GET: Dados completo do agendamento
  ↓
SYNC: Criar/atualizar evento no Google Calendar
  ├─ Título: "Consulta - {petName}"
  ├─ Descrição: "Tutor: {ownerName}, Tipo: {type}"
  ├─ Horário: {date} {time}
  └─ Notificação: 30 minutos antes
  ↓
UPDATE: Salvar google_calendar_event_id no Supabase
```

**Prompt para Claude**:
```
n8n-skills: Configure sincronização bidirecional:
1. AgendaVet → Google Calendar (criar eventos)
2. Google Calendar → AgendaVet (atualizar status se modificado)
3. Tratar cancelamentos em ambas as direções
4. Manter sincronização automática em tempo real
```

---

### Exemplo 3: Relatórios Clínicos Automáticos

**Situação**: Gerar relatório clinico resumido após cada consulta

**Workflow n8n**:

```
TRIGGER: Agendamento marcado como "completed"
  ↓
QUERY: Buscar histórico clínico do paciente (últimos 5 atendimentos)
  ↓
FORMAT: Gerar documento com:
  - Resumo da consulta
  - Medicamentos prescritos
  - Próximos passos
  - Próxima consulta recomendada
  ↓
GENERATE: Criar PDF do relatório
  ↓
EMAIL: Enviar relatório para tutor
  ↓
SAVE: Armazenar PDF no Supabase Storage
```

**Prompt para Claude**:
```
n8n-skills: Crie workflow para gerar relatórios clínicos:
1. Após cada consulta completada
2. Incluir: diagnóstico, medicamentos, próximos passos
3. Formatar como PDF profissional
4. Enviar por email ao tutor
5. Arquivar no Supabase Storage com link no banco

Usar template HTML para PDF, incluir logo da clínica.
```

---

## <a name="get-shit-done"></a>⚡ Plugin 3: get-shit-done - Exemplos de Produtividade

### Exemplo 1: Criar Novo Componente Clínico

**Situação**: Você precisa criar um novo componente para "Prescrições"

**Comando**:
```bash
gsd component --name "PrescriptionsManager" \
  --path "components/medical-records" \
  --template "crud" \
  --with-tests \
  --with-types
```

**Output Automático**:
```
✅ components/medical-records/prescriptions-manager.tsx
✅ components/medical-records/prescriptions-manager.test.tsx
✅ components/medical-records/prescriptions-manager.types.ts
✅ components/medical-records/prescriptions-manager.styles.ts
```

**Conteúdo gerado**:
```typescript
// prescriptions-manager.tsx
'use client'

import { useState, useEffect } from 'react'
import type { Prescription } from './prescriptions-manager.types'

export function PrescriptionsManager({ petId }: { petId: string }) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Fetch logic aqui
  }, [petId])

  return (
    <div className="prescriptions-container">
      {/* UI aqui */}
    </div>
  )
}
```

---

### Exemplo 2: Estruturar Nova Feature do PRD

**Situação**: Novo PRD diz "Implementar dashboard de métricas clinicas"

**Comando**:
```bash
gsd feature "clinical-metrics-dashboard" \
  --structure \
  --with-pages \
  --with-api-routes \
  --with-tests
```

**Estrutura gerada**:
```
✅ features/clinical-metrics-dashboard/
  ✅ components/
    - metrics-overview.tsx
    - metrics-charts.tsx
    - metrics-filters.tsx
  ✅ lib/
    - metrics.service.ts
    - metrics.types.ts
  ✅ pages/
    - page.tsx
    - layout.tsx
  ✅ api/
    - route.ts (GET /api/metrics)
  ✅ __tests__/
    - metrics.test.ts
  ✅ README.md
```

---

### Exemplo 3: Executar Testes Antes de Commit

**Situação**: Você quer garantir que nenhum teste quebrou antes de fazer push

**Comando**:
```bash
gsd test --pre-commit \
  --coverage \
  --report
```

**Output**:
```
🧪 Executando testes...

PASSED ✅ components/dashboard/dashboard-content.test.tsx
PASSED ✅ components/vet-copilot/vet-copilot-content.test.tsx
FAILED ❌ components/calendar/week-appointments.test.tsx
  └─ Error: Expected 'Confirmado' but got 'Agendado'

Coverage: 87%
Report: ./coverage/lcov-report/index.html

❌ PRE-COMMIT ABORTED - Corrija os testes antes de fazer commit
```

---

### Exemplo 4: Gerar e Fazer Commit Automático

**Situação**: Você criou arquivos e quer fazer commit com mensagem automática

**Comando**:
```bash
gsd commit --auto \
  --type "feat" \
  --scope "medical-records" \
  --description "Adicionar gerenciador de prescrições"
```

**Git Output**:
```
[main 3a7c2d1] feat(medical-records): Adicionar gerenciador de prescrições
 3 files changed, 256 insertions(+)
 create mode 100644 components/medical-records/prescriptions-manager.tsx
 create mode 100644 components/medical-records/prescriptions-manager.test.tsx
 create mode 100644 components/medical-records/prescriptions-manager.types.ts
```

---

## <a name="ui-ux-pro-max-skill"></a>🎨 Plugin 4: ui-ux-pro-max-skill - Exemplos de Design

### Exemplo 1: Otimizar Dashboard para Mobile

**Situação**: Dashboard fica estranho em celular, vet quer melhorar

**Prompt para Claude**:
```
ui-ux-pro-max-skill: Otimize o dashboard para mobile:
1. Analisar layout em 375px (iPhone SE)
2. Reorganizar cards para stack vertical
3. Aumentar áreas clicáveis para 48px min
4. Simplificar gráficos para mobile
5. Sugerir mudanças específicas de Tailwind

Manter desktop intacto, usar Tailwind responsive.
```

**Sugestões geradas**:
```
PROBLEMA 1: Stats cards em grid 4 colunas
├─ Desktop (>1024px): grid-cols-4 ✅
├─ Tablet (768px): grid-cols-2 → MUDA PARA grid-cols-2 ✅
└─ Mobile (<640px): grid-cols-1 → ADICIONA grid-cols-1 ⚠️

PROBLEMA 2: Tabela de agendamentos não scrollável
├─ Solução: Adicionar overflow-x-auto
├─ Tailwind: <div className="overflow-x-auto md:overflow-visible">
└─ Ou converter para cards em mobile

PROBLEMA 3: Botões muito perto
├─ Espaço atual: 2px
├─ Mínimo recomendado: 12px
├─ Tailwind: gap-2 → gap-3

CÓDIGO EXEMPLO:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
  {stats.map(stat => <StatCard key={stat.id} {...stat} />)}
</div>
```

---

### Exemplo 2: Implementar Dark Mode

**Situação**: Você quer dark mode em todo o app

**Prompt para Claude**:
```
ui-ux-pro-max-skill: Implemente dark mode completo:
1. Adicionar toggle no header
2. Salvar preferência no localStorage
3. Respeitar prefers-color-scheme do SO
4. Testar contraste em cores (WCAG AA)
5. Gerar paleta dark para veterinária

Focar em: não quebrar nada, manter acessibilidade.
```

**Tailwind Config necessário**:
```typescript
// tailwind.config.ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode
        light: {
          bg: '#FFFFFF',
          card: '#F9FAFB',
          text: '#1F2937',
        },
        // Dark mode - cores para veterinária
        dark: {
          bg: '#0F172A',      // Azul muito escuro
          card: '#1E293B',    // Azul escuro
          text: '#E2E8F0',    // Cinza claro
          accent: '#4CAF50',  // Verde médico
        }
      }
    }
  }
}
```

**Hook para Dark Mode**:
```typescript
export function useDarkMode() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Verificar preferência salva ou SO
    const saved = localStorage.getItem('theme')
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(saved ? saved === 'dark' : preferred)
  }, [])

  const toggle = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'light' : 'dark')
  }

  return { isDark, toggle }
}
```

---

### Exemplo 3: Redesenhar Fluxo de Agendamento

**Situação**: Fluxo atual tem muitos passos, tutores abandonam o formulário

**Prompt para Claude**:
```
ui-ux-pro-max-skill: Otimize fluxo de agendamento:
1. Analisar current conversion rate (assumir 60%)
2. Sugerir reduzir de 5 para 3 passos
3. Usar autocomplete para tutor/pet existente
4. Implementar 1-click para agendamento rápido
5. Mostrar confirmação visual clara

Manter validações, melhorar UX.
```

**Novo fluxo sugerido**:
```
ANTES (5 passos, 60% conclusão):
Step 1: Selecionar tutor
Step 2: Selecionar pet
Step 3: Selecionar serviço
Step 4: Selecionar data/hora
Step 5: Confirmar

DEPOIS (3 passos, esperado 85% conclusão):
Step 1: [Autocomplete tutor] [Autocomplete pet] [Select serviço]
Step 2: [Calendar picker] com horários livres em tempo real
Step 3: [Confirmar] com resumo visual

PLUS: Quick Book
├─ Para tutores/pets frequentes
├─ Um clique = agendamento em 5 segundos
└─ Usar dados padrão do tutor
```

---

### Exemplo 4: Melhorar Acessibilidade (WCAG AA)

**Situação**: Você quer certificar que app é acessível para todos

**Prompt para Claude**:
```
ui-ux-pro-max-skill: Audit de acessibilidade WCAG AA:
1. Verificar contraste de cores (min 4.5:1 para texto)
2. Testar navegação com teclado (tab order)
3. Adicionar labels em inputs
4. Implementar ARIA labels
5. Testar com screen reader (NVDA/JAWS)

Listar problemas e soluções específicas.
```

**Problemas e Soluções encontrados**:
```
PROBLEMA 1: Ícone de "lixeira" sem label
└─ Solução: <button aria-label="Deletar agendamento">
            <Trash size={20} />
          </button>

PROBLEMA 2: Contraste de texto cinza em fundo branco = 3.2:1
└─ Solução: Mudar cor de cinza claro para mais escuro
            {color: 'text-gray-700' (era 'text-gray-400')}

PROBLEMA 3: Modal não pode ser fechado com ESC
└─ Solução: <Dialog open={open} onOpenChange={setOpen}>
            Adiciona ESC handler automaticamente

PROBLEMA 4: Tabela de agendamentos sem cabeçalho acessível
└─ Solução: <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Paciente</th>
                {/* ... */}
              </tr>
            </thead>

RESULTADO: Melhor acessibilidade, 0 exclusões, WCAG AA ✅
```

---

## <a name="workflows-combinados"></a>🔄 Workflows Combinados (Superpowers + n8n + get-shit-done + ui-ux)

### Workflow 1: Feature Nova do Zero ao Produção

```
DIA 1 - PLANEJAMENTO
├─ superpowers: Analisar arquitetura
├─ n8n-skills: Planejar automações
└─ ui-ux-pro-max-skill: Wireframe no Figma

DIA 2 - DESENVOLVIMENTO
├─ get-shit-done: Estruturar novo componente
├─ superpowers: Refatorar tipos
├─ get-shit-done: Criar testes
└─ ui-ux-pro-max-skill: Otimizar responsividade

DIA 3 - INTEGRAÇÃO
├─ n8n-skills: Configurar workflows de automação
├─ superpowers: Code review automático
├─ get-shit-done: Rodar testes + commit
└─ Deploy para staging

DIA 4 - REFINAMENTO
├─ ui-ux-pro-max-skill: Feedback visual
├─ Testes com usuários
├─ get-shit-done: Corrigir bugs
└─ Deploy para produção
```

---

### Workflow 2: Otimização de Feature Existente

**Situação**: Vet-copilot está lento, você quer otimizar

```
PASSO 1 - ANÁLISE (Superpowers)
└─ Identificar gargalos, code smell, padrões repetidos

PASSO 2 - REFATORAÇÃO (Superpowers + get-shit-done)
├─ Implementar React.memo
├─ Criar hooks reutilizáveis
├─ Rodar testes automaticamente
└─ Documentar mudanças

PASSO 3 - AUTOMAÇÃO (n8n-skills)
├─ Configurar caching de respostas IA
├─ Webhook para invalidar cache
└─ Monitor de performance

PASSO 4 - DESIGN (ui-ux-pro-max-skill)
├─ Melhorar visual durante loading
├─ Feedback visual de status
└─ Acessibilidade

RESULTADO: 40% mais rápido, melhor UX, 100% accessível
```

---

## 🎯 Próximos Passos

1. **Instalar os 4 plugins** (hoje)
2. **Testar cada um** em isolation (amanhã)
3. **Combinar em workflow real** (próximos 2 dias)
4. **Documentar learnings** (contínuo)
5. **Treinar equipe** (quando houver)

---

**Criado**: 2026-03-19
**Versão**: 1.0
**Status**: Pronto para usar
