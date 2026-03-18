# KIMI Chat - Terminal Client (Bash/PowerShell)
# Versão simplificada para uso rápido

# PowerShell: .\kimi-chat-simple.ps1
# Bash: ./kimi-chat-simple.sh

param(
    [Parameter(Mandatory=$false)]
    [string]$Message = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$Brain = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Saas = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = "http://localhost:3000/api/chat"
)

# Função para enviar requisição
function Invoke-KimiChat {
    param(
        [string]$Text,
        [string]$Mode = "admin"
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
        model = "kimi"
        mode = $Mode
        enableKimiBrain = $Brain
        enableKimiCopilotSaas = $Saas
    } | ConvertTo-Json -Depth 10

    try {
        $response = Invoke-RestMethod -Uri $ApiUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 15
        return $response
    }
    catch {
        Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Se recebeu mensagem, envia e sai
if ($Message) {
    $mode = if ($Saas) { "kimi_copilot_saas" } elseif ($Brain) { "kimi_brain" } else { "admin" }
    $response = Invoke-KimiChat -Text $Message -Mode $mode
    
    if ($response) {
        Write-Host $response -ForegroundColor White
    }
    exit
}

# Modo interativo simples
Write-Host "🧠 KIMI Chat Terminal" -ForegroundColor Cyan
Write-Host "Digite 'sair' para encerrar" -ForegroundColor Gray
Write-Host ""

while ($true) {
    $userInput = Read-Host "KIMI"
    
    if ($userInput -eq "sair") {
        break
    }
    
    if ($userInput.StartsWith("KIMI ")) {
        $mode = "kimi_brain"
        $Brain = $true
    }
    elseif ($userInput -match "copilot\s+saas|agentvet") {
        $mode = "kimi_copilot_saas"
        $Saas = $true
    }
    else {
        $mode = "admin"
    }
    
    $response = Invoke-KimiChat -Text $userInput -Mode $mode
    
    if ($response) {
        Write-Host "🤖 $response" -ForegroundColor White
    }
    
    Write-Host ""
}
