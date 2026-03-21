# 🚀 Guia de Instalação e Integração dos 4 Plugins Claude Code

## Visão Geral
Este guia detalha como instalar e integrar os 4 plugins Claude Code no seu ambiente de desenvolvimento do AgendaVet para **potencializar a produtividade** e **acelerar o desenvolvimento das features finais**.

---

## 📋 Pré-requisitos
- ✅ Claude Code CLI instalado
- ✅ Projeto AgendaVet clonado localmente
- ✅ Node.js 18+ e npm instalados
- ✅ Credenciais Supabase e APIs configuradas
- ✅ Git configurado com acesso ao repositório

---

## 🎯 Plugin 1: **Superpowers** - Análise & Integração Avançada

### O que faz?
Amplifica capacidades Claude para análise profunda de código, refatoração inteligente, detecção de padrões e documentação automática.

### Instalação
```bash
# Via Claude Code CLI
claude plugin install superpowers

# Ou copie manualmente o arquivo .plugin para:
# ~/.claude/plugins/superpowers.plugin
```

### Configuração para AgendaVet
1. **Análise de código existente**
   ```
   Usar: "Claude, use a skill superpowers para analisar os padrões de arquitetura em /components"
   ```

2. **Refatoração de componentes**
   - Identifica código duplicado
   - Sugere otimizações TypeScript
   - Propõe melhor uso de hooks React

3. **Documentação automática**
   - Gera JSDoc para funções
   - Cria README para módulos
   - Documenta APIs de integração

### Casos de Uso no AgendaVet
✅ Analisar complexidade dos 17 módulos clínicos
✅ Refatorar vet-copilot para melhor performance
✅ Documentar fluxos de IA (DeepSeek, Gemini, Claude)
✅ Auditar segurança RLS no Supabase

### Exemplos de Prompts
```
1. "Superpowers: Analise todos os componentes em /components/vet-copilot e identifique padrões de otimização"
2. "Refatore dashboard-content.tsx para usar React.memo onde apropriado"
3. "Gere documentação JSDoc para todas as funções em lib/data-store.ts"
4. "Identifique code smell em components/calendar/week-appointments.tsx"
```

---

## ⚙️ Plugin 2: **n8n-skills** - Automação de Workflows

### O que faz?
Integração com n8n para automação de tarefas repetitivas, fluxos de dados, integrações com APIs externas.

### Instalação
```bash
# Via Claude Code CLI
claude plugin install n8n-skills

# Configuração n8n
# 1. Acesse https://app.n8n.cloud
# 2. Crie um novo workflow
# 3. Configure credenciais da API
```

### Configuração para AgendaVet
1. **API Key n8n**
   ```bash
   # Adicione ao .env.local
   N8N_API_KEY=your_api_key_here
   N8N_WEBHOOK_URL=your_webhook_url
   ```

2. **Workflows recomendados para AgendaVet**
   - Sincronizar agendamentos com Google Calendar
   - Enviar notificações automáticas (SMS/Email)
   - Backup automático do Supabase
   - Processar pagamentos (integração Stripe)
   - Relatórios automáticos diários

### Casos de Uso no AgendaVet
✅ Automatizar envio de lembretes de consultas
✅ Sincronizar calendário do veterinário com Google Calendar
✅ Gerar relatórios clínicos automáticos
✅ Backups automáticos do banco de dados
✅ Processar pagamentos de agendamentos

### Exemplos de Prompts
```
1. "n8n-skills: Crie um workflow para enviar SMS quando um agendamento é confirmado"
2. "Automatize o envio de relatórios clínicos diários para tutores de animais"
3. "Configure sincronização de agendamentos AgendaVet com Google Calendar"
4. "Crie webhook para processar pagamentos Stripe de consultações"
```

### Setup Workflow Exemplo
```json
{
  "workflow": "Lembretes de Consulta",
  "trigger": "Agendamento criado",
  "steps": [
    "Query Supabase para pegar dados tutores",
    "Enviar SMS via Twilio",
    "Log em tabela de notificações",
    "Webhook de confirmação"
  ]
}
```

---

## 🎯 Plugin 3: **get-shit-done** - Produtividade & Execução

### O que faz?
Automação de tarefas de desenvolvimento: criar arquivos, estruturar projetos, gerar boilerplate, rodar testes, commits automáticos.

### Instalação
```bash
claude plugin install get-shit-done

# Verificar instalação
claude --version  # deve listar o plugin
```

### Configuração para AgendaVet
1. **Configurar padrões de projeto**
   ```bash
   # Crie arquivo .gsd-config.json na raiz
   {
     "projectType": "nextjs",
     "language": "typescript",
     "componentPattern": "function",
     "testFramework": "vitest"
   }
   ```

2. **Atalhos de produtividade**
   - Criar novo componente: `gsd component`
   - Gerar tipos TypeScript: `gsd types`
   - Rodar testes: `gsd test`
   - Fazer commit automático: `gsd commit`

### Casos de Uso no AgendaVet
✅ Gerar novos componentes clínicos rapidamente
✅ Estruturar novas features do PRD
✅ Rodar testes automaticamente antes de commit
✅ Criar fixtures de teste com dados clínicos reais
✅ Gerar migrations Supabase automáticas

### Exemplos de Prompts
```
1. "gsd: Crie um novo componente 'AgendamentoRapido' em components/appointments com tipos TypeScript"
2. "Gere um template de página Next.js para a feature de 'Relatórios Clínicos'"
3. "Execute testes em todos os componentes de /components/vet-copilot"
4. "Crie um fixture de dados para testes de agendamentos com 100 pacientes"
5. "Faça commit automático com mensagem: 'feat: Adicionar módulo de relatórios clínicos'"
```

### Exemplo Prático
```bash
# Criar novo componente clínico
gsd component --name "HistoricoClinico" --path "components/medical-records"

# Resultado:
# ✅ components/medical-records/historico-clinico.tsx
# ✅ components/medical-records/historico-clinico.test.tsx
# ✅ components/medical-records/historico-clinico.types.ts
```

---

## 🎨 Plugin 4: **ui-ux-pro-max-skill** - Design & User Experience

### O que faz?
Otimização de UI/UX, temas, acessibilidade, responsividade, análise de padrões de design, sugestões de melhorias visuais.

### Instalação
```bash
claude plugin install ui-ux-pro-max-skill

# Verificar componentes Shadcn/UI disponíveis
gsd components list
```

### Configuração para AgendaVet
1. **Setup de Design System**
   ```bash
   # Verificar Tailwind configuration
   cat tailwind.config.ts
   ```

2. **Cores customizadas para veterinária**
   ```css
   /* Sugestão: adicionar ao tailwind.config.ts */
   colors: {
     'vet-primary': '#4CAF50',      /* Verde médico */
     'vet-alert': '#FF6B6B',        /* Vermelho para alertas */
     'vet-success': '#51CF66',      /* Verde sucesso */
     'vet-warning': '#FFC107'       /* Amarelo avisos */
   }
   ```

3. **Componentes recomendados para AgendaVet**
   - Cards de pacientes com avatar
   - Timeline de histórico clínico
   - Calendário interativo
   - Modals de confirmação médica
   - Gráficos de vacinação

### Casos de Uso no AgendaVet
✅ Otimizar dashboard para melhor UX
✅ Melhorar acessibilidade (WCAG AA)
✅ Design responsivo para mobile/tablet
✅ Criar tema escuro (dark mode)
✅ Melhorar velocidade de carregamento visual
✅ Redesenhar fluxos do vet-copilot

### Exemplos de Prompts
```
1. "ui-ux-pro-max-skill: Analise o dashboard e sugira melhorias de UX para veterinários"
2. "Otimize o vet-copilot para telas pequenas (mobile)"
3. "Implemente dark mode em todo o painel administrativo"
4. "Crie um design system de componentes médicos reutilizáveis"
5. "Melhore a acessibilidade do calendário de agendamentos (WCAG)"
6. "Redesenhe o fluxo de confirmação de consultas para 1-click"
```

### Componentes Sugeridos
```typescript
// Recomendações de componentes para AgendaVet:
1. PatientCard - Card com foto, nome, próxima consulta
2. VaccinationTimeline - Timeline visual de vacinações
3. ClinicMetrics - Gráficos de atividade da clínica
4. QuickActions - Botões de ação rápida
5. AppointmentFlow - Wizard de agendamento 3-passos
```

---

## 🔗 Integração Entre Plugins (Workflows Combinados)

### Cenário 1: Feature Nova do Zero ao Deploy
```
1. get-shit-done: Crie estrutura do novo componente
2. ui-ux-pro-max-skill: Otimize UI/UX
3. superpowers: Refatore e documente
4. n8n-skills: Configure automações relacionadas
5. get-shit-done: Execute testes e commit
```

### Cenário 2: Otimização de Componente Existente
```
1. superpowers: Analise padrões e code smell
2. ui-ux-pro-max-skill: Melhore visual e acessibilidade
3. get-shit-done: Refatore com testes
4. n8n-skills: Configure webhooks se necessário
```

### Cenário 3: Automação de Processo Clínico
```
1. superpowers: Analise fluxo clínico
2. n8n-skills: Crie workflow de automação
3. ui-ux-pro-max-skill: Crie interface
4. get-shit-done: Estruture código e testes
```

---

## 📊 Roadmap de Uso - Próximas 2 Semanas

### Semana 1
- ✅ Instalar todos os 4 plugins
- ✅ Fazer análise com Superpowers (17 módulos clínicos)
- ✅ Criar 2 workflows n8n (lembretes + backup)
- ✅ Gerar estrutura de 3 novas components com get-shit-done

### Semana 2
- ✅ Otimizar UI com ui-ux-pro-max-skill
- ✅ Refatorar componentes críticos (vet-copilot, dashboard)
- ✅ Configurar automações de notificação
- ✅ Testes e refinements para launch

---

## ⚠️ Dicas Importantes

1. **Comece com um plugin por vez**
   - Não instale todos simultaneamente
   - Teste cada um em isolation
   - Documente o que funciona

2. **Mantenha .env seguro**
   - Nunca committe credenciais
   - Use variáveis de ambiente
   - Adicione ao .gitignore

3. **Teste antes de usar em produção**
   - Execute em branch de desenvolvimento
   - Valide workflows manualmente
   - Faça backup antes de grandes mudanças

4. **Performance**
   - Workflows n8n podem ser lentos
   - Cache resultados quando possível
   - Monitor uso de API

---

## 🆘 Troubleshooting

### Problema: Plugin não instala
```bash
# Solução
claude logout
claude login
claude plugin install [nome-plugin]
```

### Problema: n8n webhook não dispara
```bash
# Verificar
1. Testar URL webhook com curl
2. Verificar logs em n8n.cloud
3. Confirmar credenciais de API
```

### Problema: Componente gerado com get-shit-done não compila
```bash
# Solução
1. Verificar tipos TypeScript
2. Rodar: npm run type-check
3. Corrigir imports em tsconfig.json
```

---

## 📞 Suporte & Recursos

- **Claude Code Docs**: https://claude.ai/claude-code
- **n8n Docs**: https://docs.n8n.io
- **Shadcn/UI**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com

---

## ✅ Checklist de Instalação

- [ ] Instalar Superpowers
- [ ] Instalar n8n-skills
- [ ] Instalar get-shit-done
- [ ] Instalar ui-ux-pro-max-skill
- [ ] Testar cada plugin com exemplo simples
- [ ] Configurar .env com credenciais necessárias
- [ ] Criar primeiro workflow n8n
- [ ] Gerar primeiro componente com get-shit-done
- [ ] Rodar análise com Superpowers
- [ ] Otimizar um componente com ui-ux-pro-max-skill

---

**Última atualização**: 2026-03-19
**Autor**: Claude Assistant
**Projeto**: AgendaVet
