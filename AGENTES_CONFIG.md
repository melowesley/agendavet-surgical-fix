# COMO CONFIGURAR AGENTES AGENDAVET

## 1. CONFIGURAÇÃO DAS CHAVES

### Crie o arquivo .env.local na pasta AgendaVetWeb:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_aqui

# KIMI (Moonshot)
KIMI_API_KEY=sua_chave_kimi_aqui

# Google Gemini
GOOGLE_API_KEY=sua_chave_google_aqui

# DeepSeek
DEEPSEEK_API_KEY=sua_chave_deepseek_aqui

# Anthropic Claude
ANTHROPIC_API_KEY=sua_chave_anthropic_aqui
```

## 2. ONDE OBTER AS CHAVES

### KIMI/Moonshot:
- Site: https://platform.moonshot.cn
- Registro gratuito
- Gere API Key

### Google Gemini:
- Site: https://aistudio.google.com
- API Key gratuita
- $5 crédito mensal

### DeepSeek:
- Site: https://platform.deepseek.com
- Registro gratuito
- API Key generosa

### Supabase:
- Site: https://supabase.com
- Projeto gratuito
- Settings > API

## 3. COMANDOS PARA CADA AGENTE

### KIMI BRAIN (Orquestrador):
```powershell
.\kimi-natural.ps1 "KIMI me ajude a organizar os pacientes"
.\kimi-natural.ps1 "KIMI delegue para Gemini: escreva um e-mail"
.\kimi-natural.ps1 "KIMI use DeepSeek para analisar dados"
```

### KIMI COPILOT SaaS (Administração):
```powershell
.\kimi-natural.ps1 "Liste todos os veterinários do sistema"
.\kimi-natural.ps1 "Gere relatório de uso do sistema"
.\kimi-natural.ps1 "/agents list"
```

### VET COPILOT (Clínico):
```powershell
.\kimi-natural.ps1 "Mostre o histórico do paciente Rex"
.\kimi-natural.ps1 "Verifique vacinas da Luna"
.\kimi-natural.ps1 "Calcule dose de medicação"
```

### GEMINI (Linguagem):
```powershell
.\kimi-natural.ps1 "KIMI delegue para Gemini: escreva um texto"
.\kimi-natural.ps1 "KIMI peça ao Gemini para criar um e-mail"
```

### DEEPSEEK (Análise):
```powershell
.\kimi-natural.ps1 "KIMI use DeepSeek para analisar padrões"
.\kimi-natural.ps1 "KIMI delegue análise para DeepSeek"
```

## 4. EXEMPLOS PRÁTICOS

### Análise de Cliente:
```powershell
.\kimi-natural.ps1 "KIMI, analise o cliente ID xxx e diga quanto tempo ele passa no sistema"
```

### Doenças por Raça:
```powershell
.\kimi-natural.ps1 "KIMI, quais as doenças mais comuns em Labradores?"
```

### Relatórios:
```powershell
.\kimi-natural.ps1 "KIMI, gere um relatório das consultas de hoje"
```

## 5. DEPOIS DE CONFIGURAR

1. Reinicie o servidor: `npm run dev`
2. Teste: `.\test-dashboard.ps1`
3. Use: `.\kimi-natural.ps1`

## 6. MODO INTERATIVO

```powershell
.\kimi-natural.ps1
# Depois fale naturalmente:
# "KIMI me ajude"
# "Liste os pacientes"
# "Delegue para Gemini"
```

## 7. COMANDOS ESPECIAIS

No chat interativo:
- `ajuda` - Mostra comandos
- `limpar` - Limpa histórico
- `sair` - Encerra

## 8. INTEGRAÇÃO COM DASHBOARD

```powershell
.\agendavet-dashboard.ps1  # Menu completo
# Opção 5: Pergunta personalizada
# "Use KIMI Brain para analisar os dados"
```
