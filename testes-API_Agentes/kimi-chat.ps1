# KIMI Chat Client - PowerShell Script
# Para usar: .\kimi-chat.ps1

param(
    [string]$Message,
    [switch]$Brain = $false,
    [switch]$Saas = $false,
    [string]$Model = "kimi",
    [switch]$Help = $false
)

# Configuração
$ApiUrl = "http://localhost:3000/api/chat"
$SessionFile = "$env:TEMP\kimi_session.json"

# Função para mostrar ajuda
function Show-Help {
    Write-Host "KIMI Chat Client - PowerShell" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Uso:" -ForegroundColor Yellow
    Write-Host "  .\kimi-chat.ps1 -Message 'sua mensagem'              # Envia mensagem única"
    Write-Host "  .\kimi-chat.ps1 -Brain                               # Modo KIMI Brain"
    Write-Host "  .\kimi-chat.ps1 -Saas                                # Modo KIMI Copilot SaaS"
    Write-Host "  .\kimi-chat.ps1                                      # Modo interativo"
    Write-Host ""
    Write-Host "Parâmetros:" -ForegroundColor Yellow
    Write-Host "  -Message    Mensagem para enviar (opcional)"
    Write-Host "  -Brain      Ativa modo KIMI Brain"
    Write-Host "  -Saas       Ativa modo KIMI Copilot SaaS"
    Write-Host "  -Model      Modelo: kimi, gemini, deepseek (padrão: kimi)"
    Write-Host "  -Help       Mostra esta ajuda"
    Write-Host ""
    Write-Host "Modos disponíveis:" -ForegroundColor Green
    Write-Host "  Normal     - Chat administrativo padrão"
    Write-Host "  KIMI Brain - Orquestrador de agents"
    Write-Host "  KIMI SaaS  - Copilot administrativo completo"
    Write-Host ""
    Write-Host "Exemplos:" -ForegroundColor Magenta
    Write-Host "  .\kimi-chat.ps1 -Message 'KIMI liste os pets'"
    Write-Host "  .\kimi-chat.ps1 -Brain -Message 'KIMI melhore este texto'"
    Write-Host "  .\kimi-chat.ps1 -Saas -Message '/agents list'"
}

# Função para enviar mensagem para API
function Send-KimiMessage {
    param(
        [string]$Text,
        [string]$Mode = "admin",
        [bool]$EnableBrain = $false,
        [bool]$EnableSaas = $false,
        [string]$SelectedModel = "kimi"
    )
    
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
        model = $SelectedModel
        temperature = 0.3
        mode = $Mode
        enableKimiBrain = $EnableBrain
        enableKimiCopilotSaas = $EnableSaas
    } | ConvertTo-Json -Depth 10

    try {
        $response = Invoke-RestMethod -Uri $ApiUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 30
        return $response
    }
    catch {
        Write-Host "❌ Erro ao conectar com a API: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Verifique se o servidor AgendaVet está rodando em localhost:3000" -ForegroundColor Yellow
        return $null
    }
}

# Função para exibir resposta streaming
function Show-StreamingResponse {
    param([string]$ResponseText)
    
    # Simula streaming (em produção, implementar SSE)
    $lines = $ResponseText -split "`n"
    foreach ($line in $lines) {
        Write-Host $line -ForegroundColor White
        Start-Sleep -Milliseconds 50
    }
}

# Função modo interativo
function Start-InteractiveMode {
    param(
        [bool]$BrainMode = $false,
        [bool]$SaasMode = $false,
        [string]$SelectedModel = "kimi"
    )
    
    $modeName = if ($SaasMode) { "KIMI Copilot SaaS" } elseif ($BrainMode) { "KIMI Brain" } else { "Normal" }
    $promptColor = if ($SaasMode) { "Magenta" } elseif ($BrainMode) { "Purple" } else { "Cyan" }
    
    Write-Host "🧠 KIMI Chat - Modo: $modeName" -ForegroundColor $promptColor
    Write-Host "Digite 'sair' para encerrar" -ForegroundColor Gray
    Write-Host "───────────────────────────────────────" -ForegroundColor $promptColor
    Write-Host ""
    
    # Carrega histórico se existir
    $history = @()
    if (Test-Path $SessionFile) {
        try {
            $history = Get-Content $SessionFile | ConvertFrom-Json
        }
        catch {
            $history = @()
        }
    }
    
    while ($true) {
        try {
            # Correção da cor do prompt aplicada aqui!
            Write-Host "KIMI: " -ForegroundColor $promptColor -NoNewline
            $input = Read-Host
            
            if ($input -eq "sair" -or $input -eq "exit" -or $input -eq "quit") {
                Write-Host "👋 Até logo!" -ForegroundColor Green
                break
            }
            
            if ([string]::IsNullOrWhiteSpace($input)) {
                continue
            }
            
            # Adiciona ao histórico
            $history += @{ role = "user"; content = $input; timestamp = Get-Date }
            
            # Envia mensagem
            Write-Host "🤔 Processando..." -ForegroundColor Yellow -NoNewline
            $response = Send-KimiMessage -Text $input -Mode (if ($SaasMode) { "kimi_copilot_saas" } elseif ($BrainMode) { "kimi_brain" } else { "admin" }) -EnableBrain $BrainMode -EnableSaas $SaasMode -SelectedModel $SelectedModel
            
            if ($response) {
                Write-Host "`r✅ " -ForegroundColor Green
                Write-Host ""
                Write-Host "🤖 KIMI:" -ForegroundColor $promptColor
                Show-StreamingResponse -ResponseText $response
                Write-Host ""
                
                # Adiciona resposta ao histórico
                $history += @{ role = "assistant"; content = $response; timestamp = Get-Date }
                
                # Salva histórico (limita últimas 20 mensagens)
                $history | Select-Object -Last 20 | ConvertTo-Json -Depth 10 | Out-File $SessionFile
            }
            else {
                Write-Host "`r❌ Falha na comunicação" -ForegroundColor Red
            }
        }
        catch {
            Write-Host "`r❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Script principal
if ($Help) {
    Show-Help
    exit
}

# Determina o modo
$mode = "admin"
$enableBrain = $Brain.IsPresent
$enableSaas = $Saas.IsPresent

if ($Saas.IsPresent) {
    $mode = "kimi_copilot_saas"
}
elseif ($Brain.IsPresent) {
    $mode = "kimi_brain"
}

# Se tem mensagem única, envia e sai
if ($Message) {
    Write-Host "🧠 Enviando para KIMI..." -ForegroundColor Cyan
    $response = Send-KimiMessage -Text $Message -Mode $mode -EnableBrain $enableBrain -EnableSaas $enableSaas -SelectedModel $Model
    
    if ($response) {
        Write-Host "✅ Resposta recebida:" -ForegroundColor Green
        Write-Host ""
        Write-Host $response -ForegroundColor White
    }
    exit
}

# Senão, modo interativo
Start-InteractiveMode -BrainMode $Brain.IsPresent -SaasMode $Saas.IsPresent -SelectedModel $Model