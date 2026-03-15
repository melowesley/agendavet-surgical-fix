# AgendaVet Dashboard - Guia de Uso

## Scripts Disponíveis

### 1. Dashboard Completo Interativo
**`agendavet-dashboard.ps1`** - Menu interativo com análises detalhadas

```powershell
# Executar dashboard completo
.\agendavet-dashboard.ps1

# Com auto-refresh a cada 30 segundos
.\agendavet-dashboard.ps1 -AutoRefresh -RefreshInterval 30

# Usar Gemini em vez do KIMI
.\agendavet-dashboard.ps1 -Model "gemini"
```

**Recursos:**
- 📊 Estatísticas em tempo real
- 🤖 Insights da IA automáticos
- 🎮 Menu interativo com 6 opções
- 🔄 Auto-refresh opcional
- 💡 Análises personalizadas

### 2. Dashboard Rápido
**`agendavet-quick.ps1`** - Estatísticas instantâneas

```powershell
# Visão geral do sistema
.\agendavet-quick.ps1

# Análise de cliente específico
.\agendavet-quick.ps1 -ClientId "uuid-do-cliente"

# Foco em dados de hoje
.\agendavet-quick.ps1 -Today
```

**Recursos:**
- ⚡ Execução instantânea
- 👤 Análise por cliente
- 📅 Filtro por data
- 🤖 Insights automáticos

## O Que os Dashboards Mostram

### 📊 Estatísticas Básicas
- Total de pacientes, donos e consultas
- Distribuição por espécie
- Atividades do dia
- Pacientes recentes

### 🤖 Insights da IA
- "Qual foi a espécie mais atendida hoje?"
- "Existe padrão nos horários de agendamento?"
- "Quantos novos pacientes esta semana?"
- "Qual o status geral das consultas?"

### 🎮 Menu Interativo (Dashboard Completo)
1. **Análise detalhada de pacientes** - Distribuição completa
2. **Relatório de consultas do dia** - Status e horários
3. **Tempo médio de permanência** - Análise de engajamento
4. **Doenças mais comuns por raça** - Padrões clínicos
5. **Pergunta personalizada à IA** - Consulta livre
6. **Atualizar dashboard** - Refresh manual

## Exemplos de Uso

### Análise de Cliente Específico
```powershell
# Descubra o UUID do cliente primeiro
.\agendavet-quick.ps1

# Depois analise em detalhes
.\agendavet-dashboard.ps1
# Escolha opção 5 e pergunte:
# "Quanto tempo o cliente ID xxx passou com o sistema aberto?"
```

### Análise de Doenças por Raça
```powershell
.\agendavet-dashboard.ps1
# Escolha opção 4: "Doenças mais comuns por raça"
# A IA analisará os dados e mostrará padrões
```

### Tempo de Permanência no Sistema
```powershell
.\agendavet-dashboard.ps1
# Escolha opção 3: "Tempo médio de permanência"
# Ou opção 5 e pergunte diretamente:
# "Qual o tempo médio que os clientes passam no sistema?"
```

## Pré-requisitos

1. **Servidor AgendaVet rodando** em `localhost:3000`
2. **Variáveis de ambiente** configuradas:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. **PowerShell** no Windows

## Personalização

### Mudar Modelo de IA
```powershell
# Usar Gemini
.\agendavet-dashboard.ps1 -Model "gemini"

# Usar DeepSeek
.\agendavet-dashboard.ps1 -Model "deepseek"
```

### Adicionar Novas Análises
Edite o script para adicionar novas opções ao menu ou novas perguntas à IA.

### Auto-Refresh
```powershell
# Dashboard que atualiza sozinho
.\agendavet-dashboard.ps1 -AutoRefresh -RefreshInterval 60
```

## Integração com Outras Ferramentas

Os scripts podem ser:
- **Agendados** no Task Scheduler
- **Integrados** com VSCode tasks
- **Automatizados** em scripts maiores
- **Compartilhados** com a equipe

## Troubleshooting

1. **"Não foi possível carregar estatísticas"**
   - Verifique se o servidor está rodando
   - Confirme as variáveis de ambiente

2. **"Erro na IA"**
   - Verifique se a API `/api/chat` está funcionando
   - Confirme a chave da API KIMI

3. **Permissões no PowerShell**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
