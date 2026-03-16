# KIMI Natural Language Terminal
# Fale com KIMI em português natural: "KIMI me ajude", "KIMI liste os pacientes", etc.

param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$InputText = @()
)

# Configuração
$ApiUrl = "http://localhost:3000/api/chat"
$HistoryFile = "$env:USERPROFILE\Documents\kimi_history.txt"

# Cores para melhor visualização
$colors = @{
    user = "Cyan"
    kimi = "White"
    thinking = "Yellow"
    success = "Green"
    error = "Red"
    brain = "Purple"
    saas = "Magenta"
    admin = "Blue"
}

# Função para detectar intenção e modo
function Get-KimiIntent {
    param([string]$Text)
    
    $text = $Text.ToLower()
    
    # Detecta modo KIMI Brain
    if ($text -match "kimi.*brain|orquest|deleg|melhor|coorden|cerebr") {
        return @{
            mode = "kimi_brain"
            enableBrain = $true
            enableSaas = $false
            intent = "brain"
        }
    }
    
    # Detecta modo KIMI Copilot SaaS
    if ($text -match "copilot.*saas|saas.*copilot|agentvet|admin.*sistema|gerenciar.*vets|multi.*clinic") {
        return @{
            mode = "kimi_copilot_saas"
            enableBrain = $false
            enableSaas = $true
            intent = "saas"
        }
    }
    
    # Detecta comandos administrativos
    if ($text -match "/agents|/clinic|/deploy|/report|/update|/list") {
        return @{
            mode = "kimi_copilot_saas"
            enableBrain = $false
            enableSaas = $true
            intent = "admin_cmd"
        }
    }
    
    # Detecta menção ao KIMI
    if ($text -match "^kimi\s|^\s*kimi\s") {
        return @{
            mode = "kimi_brain"
            enableBrain = $true
            enableSaas = $false
            intent = "kimi_mention"
        }
    }
    
    # Detecta comandos clínicos
    if ($text -match "paciente|pet|animal|histórico|vacina|medicação|dose|exame|sintoma") {
        return @{
            mode = "clinical"
            enableBrain = $false
            enableSaas = $false
            intent = "clinical"
        }
    }
    
    # Padrão: modo admin
    return @{
        mode = "admin"
        enableBrain = $false
        enableSaas = $false
        intent = "general"
    }
}

# Função para enviar mensagem
function Send-ToKimi {
    param([string]$Text)
    
    $intent = Get-KimiIntent -Text $Text
    
    $body = @{
        messages = @(
            @{
                role = "user"
                parts = @(
                    @{
                        type = "text"
                        text = $Text
                    }
                )
            }
        )
        model = "kimi"
        mode = $intent.mode
        enableKimiBrain = $intent.enableBrain
        enableKimiCopilotSaas = $intent.enableSaas
        temperature = 0.3
    } | ConvertTo-Json -Depth 10
    
    try {
        Write-Host "🤔 " -ForegroundColor $colors.thinking -NoNewline
        
        $response = Invoke-RestMethod -Uri $ApiUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 20
        
        Write-Host "`r✅ " -ForegroundColor $colors.success
        
        # Salva no histórico
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Add-Content -Path $HistoryFile -Value "[$timestamp] Você: $Text"
        Add-Content -Path $HistoryFile -Value "[$timestamp] KIMI [$($intent.mode)]: $response"
        Add-Content -Path $HistoryFile -Value "---"
        
        return @{
            response = $response
            mode = $intent.mode
            intent = $intent.intent
        }
    }
    catch {
        Write-Host "`r❌ " -ForegroundColor $colors.error
        Write-Host "Erro ao conectar: $($_.Exception.Message)" -ForegroundColor $colors.error
        return $null
    }
}

# Função para exibir resposta com cores
function Show-KimiResponse {
    param([hashtable]$Result)
    
    if (-not $Result) { return }
    
    $modeColor = switch ($Result.mode) {
        "kimi_brain" { $colors.brain }
        "kimi_copilot_saas" { $colors.saas }
        "clinical" { "Green" }
        default { $colors.admin }
    }
    
    $modeName = switch ($Result.mode) {
        "kimi_brain" { "KIMI Brain" }
        "kimi_copilot_saas" { "KIMI Copilot SaaS" }
        "clinical" { "Vet Copilot" }
        default { "Assistente" }
    }
    
    Write-Host ""
    Write-Host "🤖 $($modeName):" -ForegroundColor $modeColor
    Write-Host $Result.response -ForegroundColor $colors.kimi
    Write-Host ""
}

# Função para mostrar sugestões baseadas no modo
function Show-Suggestions {
    param([string]$Mode)
    
    $suggestions = switch ($Mode) {
        "kimi_brain" {
            @(
                "KIMI melhore este texto: ...",
                "KIMI delegue para Gemini: escreva um e-mail",
                "KIMI use DeepSeek para analisar dados",
                "KIMI modo clínico",
                "KIMI resuma os pacientes de hoje"
            )
        }
        "kimi_copilot_saas" {
            @(
                "Liste todos os veterinários ativos",
                "Gere relatório de uso do sistema",
                "Atualize configurações do Dr. Silva",
                "Deploy nova versão do prompt",
                "Mude para a clínica Central"
            )
        }
        "clinical" {
            @(
                "Mostre o histórico do Rex",
                "Verifique vacinas da Luna",
                "Calcule dose de antibiótico",
                "Liste medicamentos atuais",
                "Busque exames recentes"
            )
        }
        default {
            @(
                "Quantos pacientes temos?",
                "Agendamentos de hoje",
                "Dicas para pets ansiosos",
                "Status da clínica",
                "Ajuda com o sistema"
            )
        }
    }
    
    Write-Host "💡 Sugestões:" -ForegroundColor Gray
    foreach ($suggestion in $suggestions) {
        Write-Host "   • $suggestion" -ForegroundColor Gray
    }
    Write-Host ""
}

# Função modo interativo
function Start-InteractiveMode {
    Write-Host ""
    Write-Host "🧠 KIMI Terminal - Linguagem Natural" -ForegroundColor Cyan
    Write-Host "Fale com o KIMI como se estivesse conversando!" -ForegroundColor Gray
    Write-Host "Exemplos:" -ForegroundColor Yellow
    Write-Host "   • 'KIMI me ajude a organizar os pacientes'" -ForegroundColor Gray
    Write-Host "   • 'Liste todos os veterinários do sistema'" -ForegroundColor Gray
    Write-Host "   • 'KIMI melhore este texto: O paciente está bem'" -ForegroundColor Gray
    Write-Host "   • 'Mostre o histórico do Rex'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Digite 'sair', 'ajuda' ou 'limpar' para comandos especiais" -ForegroundColor Yellow
    Write-Host "───────────────────────────────────────────────────────" -ForegroundColor Cyan
    Write-Host ""
    
    while ($true) {
        try {
            $userInput = Read-Host -Prompt "Você"
            
            if ($userInput -match "sair|exit|quit") {
                Write-Host "👋 Até logo!" -ForegroundColor $colors.success
                break
            }
            
            if ($userInput -match "ajuda|help") {
                Write-Host ""
                Write-Host "📖 Comandos disponíveis:" -ForegroundColor Yellow
                Write-Host "   • Fale naturalmente: 'KIMI liste os pacientes'" -ForegroundColor Gray
                Write-Host "   • Modo Brain: 'KIMI melhore este texto'" -ForegroundColor Gray
                Write-Host "   • Modo SaaS: 'Gerencie os veterinários'" -ForegroundColor Gray
                Write-Host "   • Clínico: 'Histórico do paciente Rex'" -ForegroundColor Gray
                Write-Host "   • 'limpar' - Limpa o histórico" -ForegroundColor Gray
                Write-Host "   • 'sair' - Encerra o chat" -ForegroundColor Gray
                Write-Host ""
                continue
            }
            
            if ($userInput -match "limpar|clear") {
                if (Test-Path $HistoryFile) {
                    Remove-Item $HistoryFile
                    Write-Host "🧹 Histório limpo!" -ForegroundColor $colors.success
                }
                continue
            }
            
            if ([string]::IsNullOrWhiteSpace($userInput)) {
                continue
            }
            
            # Envia para KIMI
            $result = Send-ToKimi -Text $userInput
            Show-KimiResponse -Result $result
            
            # Mostra sugestões
            if ($result) {
                Show-Suggestions -Mode $result.mode
            }
        }
        catch {
            Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor $colors.error
        }
    }
}

# Script principal
if ($InputText.Count -gt 0) {
    # Modo comando único
    $text = $InputText -join " "
    Write-Host "🧠 Enviando: $text" -ForegroundColor Cyan
    $result = Send-ToKimi -Text $text
    Show-KimiResponse -Result $result
}
else {
    # Modo interativo
    Start-InteractiveMode
}
