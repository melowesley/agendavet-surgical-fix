# KIMI Natural Language - Exemplos de Uso

## Como Usar

### 1. Modo Interativo (Recomendado)
```powershell
# Abre o chat natural
.\kimi-natural.ps1

# Exemplos de conversação:
Você: KIMI me ajude a organizar os pacientes de hoje
🤖 KIMI Brain: Vou analisar seus pacientes e organizar por prioridade...

Você: Liste todos os veterinários do sistema
🤖 KIMI Copilot SaaS: Encontrei 3 veterinários ativos...

Você: Mostre o histórico do Rex
🤖 Vet Copilot: Aqui está o histórico completo do paciente Rex...
```

### 2. Comando Único
```powershell
# Frases em linguagem natural
.\kimi-natural.ps1 "KIMI melhore este texto: O paciente está bem"
.\kimi-natural.ps1 "Quantos pacientes temos na clínica?"
.\kimi-natural.ps1 "Verifique as vacinas da Luna"
.\kimi-natural.ps1 "KIMI delegue ao Gemini para escrever um e-mail"
```

## Inteligência de Contexto

O script detecta automaticamente:

### 🧠 KIMI Brain (Orquestrador)
- "KIMI melhore este texto..."
- "KIMI delegue para Gemini..."
- "KIMI use DeepSeek para analisar..."
- "KIMI me ajude a organizar..."
- "KIMI resuma os pacientes..."

### 🏥 Modo Clínico
- "Histórico do paciente..."
- "Verifique vacinas de..."
- "Calcule dose de..."
- "Liste medicamentos atuais..."
- "Busque exames recentes..."

### 💼 KIMI Copilot SaaS (Administração)
- "Liste todos os veterinários..."
- "Gerencie as configurações..."
- "Gere relatório de uso..."
- "/agents list"
- "Atualize o Dr. Silva..."

### 📋 Modo Admin (Padrão)
- "Quantos pacientes temos?"
- "Agendamentos de hoje"
- "Status da clínica"
- "Ajuda com o sistema"

## Comandos Especiais

No modo interativo:
- `ajuda` - Mostra comandos disponíveis
- `limpar` - Limpa o histórico
- `sair` - Encerra o chat

## Exemplos Práticos

```powershell
# 1. Orquestração com KIMI Brain
.\kimi-natural.ps1 "KIMI melhore este texto: O paciente precisa de cuidados"

# 2. Administração SaaS
.\kimi-natural.ps1 "Liste todos os veterinários e suas especialidades"

# 3. Clínico direto
.\kimi-natural.ps1 "Mostre o histórico médico completo do Max"

# 4. Delegação inteligente
.\kimi-natural.ps1 "KIMI peça ao Gemini para escrever um e-mail para o dono do pet"

# 5. Análise de dados
.\kimi-natural.ps1 "KIMI use DeepSeek para analisar os padrões de vacinação"
```

## Histórico de Conversa

O script salva automaticamente em:
`%USERPROFILE%\Documents\kimi_history.txt`

Use `limpar` no chat para apagar o histórico.

## Personalização

Você pode modificar o script para:
- Adicionar novos padrões de detecção
- Mudar cores e temas
- Adicionar comandos personalizados
- Integrar com outras APIs
