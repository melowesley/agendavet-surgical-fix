# 🧪 PLUGINS - PROMPTS PARA TESTAR (Sem Instalação)

**Objetivo**: Testar cada plugin copiando e colando os prompts abaixo para ver se funcionam para seu projeto.

**Como usar**:
1. Copie UM prompt por vez
2. Cole para o Claude em uma conversa separada
3. Veja o resultado
4. Decida se quer usar o plugin

---

## 🔥 SUPERPOWERS - PROMPTS PARA TESTAR

### Teste 1: Análise Rápida de Componente

**Copie e cole este prompt:**

```
Superpowers: Analise o arquivo components/dashboard/dashboard-content.tsx 
e identifique:
1. Um padrão que se repete
2. Uma oportunidade de performance
3. Um tipo TypeScript que poderia ser melhor

Seja conciso, máximo 5 linhas por item.
```

**O que esperar**: 
- Claude vai analisar o arquivo
- Vai encontrar padrões reais
- Vai sugerir otimizações específicas

---

### Teste 2: Refatoração com Segurança de Tipos

**Copie e cole este prompt:**

```
Superpowers: Refatore este código para remover 'as any':

import type { Appointment } from '@/lib/types'

const handleStatusChange = (id: string, newStatus: string) => {
  updateAppointment(id, { status: newStatus as any })
}

Mostre a versão melhorada com tipos corretos.
```

**O que esperar**:
- Claude vai corrigir o 'as any'
- Vai propor tipos mais específicos
- Código 100% type-safe

---

### Teste 3: Documentação Automática

**Copie e cole este prompt:**

```
Superpowers: Gere documentação JSDoc para esta função:

export function usePets() {
  const { pets, isLoading } = usePets()
  const [selectedPet, setSelectedPet] = useState(null)
  
  return { pets, isLoading, selectedPet, setSelectedPet }
}

Inclua: descrição, @returns, @example
```

**O que esperar**:
- Claude gera JSDoc completo
- Com tipos e exemplos
- Pronto para copiar-colar

---

### Teste 4: Code Review Automático

**Copie e cole este prompt:**

```
Superpowers: Faça code review deste componente e liste problemas:

'use client'

import { useState } from 'react'

export function AppointmentForm() {
  const [form, setForm] = useState(null)
  
  const handleSubmit = async (e) => {
    const data = await fetch('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(form)
    })
    return data
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}

Procure por: segurança, performance, acessibilidade, tipos.
```

**O que esperar**:
- Lista de problemas encontrados
- Recomendações de correção
- Código melhorado

---

## ⚙️ N8N-SKILLS - PROMPTS PARA TESTAR

### Teste 1: Webhook Simples

**Copie e cole este prompt:**

```
n8n-skills: Crie um workflow n8n que:

1. Receba POST webhook com JSON: {appointmentId, status}
2. Faça log dos dados
3. Responda com: {"success": true}

Mostre a configuração do webhook e os steps do workflow.
```

**O que esperar**:
- Claude descreve configuração do webhook
- Passos do workflow
- Exemplo de JSON de entrada

---

### Teste 2: Automação de Email

**Copie e cole este prompt:**

```
n8n-skills: Crie um workflow que:

1. Dispare quando agendamento é criado
2. Busque dados do tutor no Supabase
3. Envie email de confirmação

Mostre: trigger, query, email template, steps necessários.
```

**O que esperar**:
- Estrutura do workflow
- Queries exemplo
- Email template

---

### Teste 3: Sincronização de Calendário

**Copie e cole este prompt:**

```
n8n-skills: Como sincronizar agendamentos AgendaVet com Google Calendar?

Mostre:
1. Steps necessários
2. Autenticação Google
3. Mapping de campos (AgendaVet → Google Calendar)
4. Tratamento de atualizações
```

**O que esperar**:
- Passo-a-passo de setup
- Configurações necessárias
- Mapping de campos

---

### Teste 4: Relatório Automático

**Copie e cole este prompt:**

```
n8n-skills: Crie workflow para gerar relatório diário:

1. Query: SELECT COUNT(*) FROM appointments WHERE date = TODAY
2. Calcule: total, confirmados, cancelados
3. Envie para Slack: mensagem formatada
4. Salve em Supabase: tabela de relatórios

Mostre a estrutura do workflow.
```

**O que esperar**:
- Estrutura completa do workflow
- Queries SQL
- Formatação de mensagem
- Como salvar dados

---

## ⚡ GET-SHIT-DONE - PROMPTS PARA TESTAR

### Teste 1: Estrutura de Componente

**Copie e cole este prompt:**

```
get-shit-done: Crie a estrutura para um novo componente React:

Nome: PrescriptionsManager
Tipo: CRUD (Create, Read, Update, Delete)
Caminho: components/medical-records

Mostre:
- Nome dos arquivos a criar
- Estrutura de cada arquivo
- Tipos TypeScript
- Exemplo de teste
```

**O que esperar**:
- Lista de arquivos a criar
- Código skeleton
- Estrutura completa

---

### Teste 2: Estruturar Feature

**Copie e cole este prompt:**

```
get-shit-done: Estruture uma feature nova chamada "clinical-metrics-dashboard"

Inclua:
- Pastas a criar
- Componentes necessários
- Tipos TypeScript
- API routes
- Arquivo de testes
- Arquivo README

Mostre a estrutura de diretório.
```

**O que esperar**:
- Árvore de diretórios
- Arquivos necessários
- Organização profissional

---

### Teste 3: Gerar Testes

**Copie e cole este prompt:**

```
get-shit-done: Crie um teste unitário para esta função:

function usePets() {
  const { pets, isLoading } = usePets()
  return { pets, isLoading }
}

Mostre um teste completo usando Vitest que:
1. Mock do Supabase
2. Testa loading state
3. Testa retorno de dados
4. Testa erro
```

**O que esperar**:
- Teste completo pronto
- Setup de mocks
- Todos os casos cobertos

---

### Teste 4: Validação TypeScript

**Copie e cole este prompt:**

```
get-shit-done: Verifique este código TypeScript:

const appointment: Appointment = {
  id: "1",
  date: "2026-03-20",
  status: "pending",
  notes: null,
  owner: { name: "João" }
}

Problemas:
- Qual seria a tipagem correta?
- Faltam campos obrigatórios?
- Há incompatibilidade de tipos?

Mostre a versão corrigida.
```

**O que esperar**:
- Problemas de tipo identificados
- Versão corrigida
- Explicação de cada mudança

---

## 🎨 UI-UX-PRO-MAX - PROMPTS PARA TESTAR

### Teste 1: Otimizar para Mobile

**Copie e cole este prompt:**

```
ui-ux-pro-max-skill: Otimize este layout para 375px (iPhone SE):

Situação: Dashboard com 4 cards em grid 4 colunas

Problemas atuais:
- Muito pequeno em mobile
- Botões muito perto
- Gráficos ilegíveis

Mostre:
1. Problemas específicos
2. Classes Tailwind para desktop
3. Classes Tailwind para mobile
4. Código antes/depois
```

**O que esperar**:
- Análise específica do mobile
- Classes Tailwind concretas
- Breakpoints explicados

---

### Teste 2: Implementar Dark Mode

**Copie e cole este prompt:**

```
ui-ux-pro-max-skill: Implemente dark mode com Tailwind:

Situação: Componente com bg-white, text-black

Mostre:
1. Configuração Tailwind (darkMode)
2. Hook para dark mode
3. Classes atualizadas do componente
4. localStorage para persistência
5. Exemplo completo
```

**O que esperar**:
- Config Tailwind pronta
- Hook reutilizável
- Classe atualizada
- Código funcional

---

### Teste 3: Audit de Acessibilidade

**Copie e cole este prompt:**

```
ui-ux-pro-max-skill: Audit de acessibilidade WCAG AA:

Código atual:
<button><Trash size={20} /></button>
<input type="text" />
<table><tr><td>Data</td></tr></table>

Problemas WCAG:
1. Botão sem label
2. Input sem label
3. Tabela sem headers

Mostre a versão acessível com aria-labels e semântica correta.
```

**O que esperar**:
- Problemas identificados
- Código corrigido
- WCAG AA compliant

---

### Teste 4: Redesenhar Fluxo

**Copie e cole este prompt:**

```
ui-ux-pro-max-skill: Otimize fluxo de agendamento:

Fluxo ATUAL (5 passos):
Step 1 → Select Tutor
Step 2 → Select Pet  
Step 3 → Select Service
Step 4 → Select Date/Time
Step 5 → Confirm

Taxa de conclusão: 60%

Objetivo: Reduzir para 3 passos, aumentar para 85%

Mostre:
1. Novo fluxo (3 passos)
2. Mudanças de UI/UX
3. Como validar redução de abandono
```

**O que esperar**:
- Novo fluxo simplificado
- Mudanças de componentes
- Justificativa das mudanças

---

## 📊 COMO TESTAR TODOS OS 4 PLUGINS

### Timeline Recomendada:

**Dia 1**:
- [ ] Teste 1 de Superpowers
- [ ] Teste 1 de n8n-skills
- [ ] Teste 1 de get-shit-done
- [ ] Teste 1 de ui-ux-pro-max

**Dia 2**:
- [ ] Teste 2 de cada plugin

**Dia 3**:
- [ ] Teste 3 e 4 de cada plugin

**Dia 4**:
- [ ] Teste os prompts mais relevantes para seu caso
- [ ] Decida quais plugins usar em produção

---

## 💡 DICAS PARA TESTAR

1. **Copie exatamente** - Os prompts estão otimizados
2. **Adapte se necessário** - Use seus componentes reais
3. **Documente resultados** - Salve os prompts que funcionam
4. **Compare com alternativas** - Veja qual plugin funciona melhor
5. **Iteração** - Refine prompts baseado em feedback

---

## 🎯 O QUE ESPERAR DE CADA TESTE

### Superpowers:
- ✅ Análise de código específica
- ✅ Problemas e soluções reais
- ✅ Código melhorado
- ✅ Explicações detalhadas

### n8n-skills:
- ✅ Estrutura de workflow clara
- ✅ Passos e configurações
- ✅ Exemplos de JSON
- ✅ Como integrar

### get-shit-done:
- ✅ Estrutura de diretórios
- ✅ Código skeleton pronto
- ✅ Tipos definidos
- ✅ Testes exemplo

### ui-ux-pro-max:
- ✅ Análise de problemas
- ✅ Classes Tailwind específicas
- ✅ Código antes/depois
- ✅ Recomendações de UX

---

## ✅ CHECKLIST DE TESTES

- [ ] Superpowers - Teste 1 (Análise)
- [ ] Superpowers - Teste 2 (Refatoração)
- [ ] Superpowers - Teste 3 (Documentação)
- [ ] Superpowers - Teste 4 (Code Review)
- [ ] n8n-skills - Teste 1 (Webhook)
- [ ] n8n-skills - Teste 2 (Email)
- [ ] n8n-skills - Teste 3 (Google Calendar)
- [ ] n8n-skills - Teste 4 (Relatório)
- [ ] get-shit-done - Teste 1 (Componente)
- [ ] get-shit-done - Teste 2 (Feature)
- [ ] get-shit-done - Teste 3 (Testes)
- [ ] get-shit-done - Teste 4 (TypeScript)
- [ ] ui-ux-pro-max - Teste 1 (Mobile)
- [ ] ui-ux-pro-max - Teste 2 (Dark Mode)
- [ ] ui-ux-pro-max - Teste 3 (Acessibilidade)
- [ ] ui-ux-pro-max - Teste 4 (Fluxo)

**Total: 16 testes, ~1-2 minutos cada = 30 minutos**

---

## 🚀 PRÓXIMO PASSO

1. **Copie um prompt** de cima
2. **Abra conversa com Claude** em nova aba
3. **Cole o prompt**
4. **Veja o resultado**
5. **Decida se quer usar**
6. **Repita com próximo prompt**

---

**Criado**: 2026-03-19
**Status**: ✅ Pronto para testar
**Tempo total**: ~30 minutos para testar todos os 4 plugins

Melo, é assim que você vai descobrir qual plugin realmente funciona melhor para o AgendaVet! 🧪💪
