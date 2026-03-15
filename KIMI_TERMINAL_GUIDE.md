# KIMI Terminal Chat - Guia Rápido

## Scripts Disponíveis

### 1. PowerShell (Windows)
```powershell
# Versão completa com ajuda
.\kimi-chat.ps1 -Help

# Enviar mensagem única
.\kimi-chat.ps1 -Message "KIMI liste os pets"

# Modo KIMI Brain
.\kimi-chat.ps1 -Brain -Message "KIMI melhore este texto"

# Modo KIMI Copilot SaaS
.\kimi-chat.ps1 -Saas -Message "/agents list"

# Modo interativo
.\kimi-chat.ps1 -Brain
.\kimi-chat.ps1 -Saas
.\kimi-chat.ps1

# Versão simplificada
.\kimi-chat-simple.ps1 "KIMI como você está?"
```

### 2. Bash (Linux/macOS)
```bash
# Dar permissão
chmod +x kimi-chat.sh

# Enviar mensagem única
./kimi-chat.sh "KIMI liste os pets"

# Modo KIMI Brain
./kimi-chat.sh --brain "KIMI melhore este texto"

# Modo KIMI Copilot SaaS
./kimi-chat.sh --saas "/agents list"

# Modo interativo
./kimi-chat.sh --brain
./kimi-chat.sh --saas
./kimi-chat.sh

# Mostrar ajuda
./kimi-chat.sh --help
```

## Requisitos

1. **Servidor AgendaVet rodando** em `localhost:3000`
2. **PowerShell** (Windows) ou **Bash** (Linux/macOS)
3. **Conexão com a API KIMI** configurada

## Modos Disponíveis

- **Normal**: Chat administrativo padrão
- **KIMI Brain**: Orquestrador de agents
- **KIMI Copilot SaaS**: Copilot administrativo completo

## Exemplos de Uso

### Comandos KIMI Brain
```
KIMI melhore o diálogo
KIMI delegue para Gemini
KIMI use DeepSeek
KIMI modo clínico
```

### Comandos SaaS
```
/agents list
/agent update vet_001
/deploy prompt v12
/clinic switch clinic_002
/report usage
```

## Personalização

Edite os scripts para:
- Mudar URL da API (padrão: `http://localhost:3000/api/chat`)
- Alterar modelo padrão (kimi, gemini, deepseek)
- Adicionar atalhos personalizados
- Modificar cores e prompts

## Troubleshooting

1. **Erro de conexão**: Verifique se o servidor está rodando
2. **Timeout**: Aumente o timeout no script
3. **Permissões**: No Linux/macOS: `chmod +x kimi-chat.sh`
4. **PowerShell execution policy**: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

## Integração com Outras Ferramentas

Os scripts podem ser integrados com:
- **VSCode tasks**
- **GitHub Actions**
- **CI/CD pipelines**
- **Automatizações diversas**
