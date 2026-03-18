# KIMI Chat Terminal - Versao Simplificada
# Execute: .\kimi-simple.ps1

param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string]$Message = ""
)

# Config
$ApiUrl = "http://localhost:3000/api/chat"

function Send-ToKimi {
    param([string]$Text)
    
    $body = @{
        messages = @(@{
            role = "user"
            parts = @(@{ type = "text"; text = $Text })
        })
        model = "kimi"
        mode = "admin"
    } | ConvertTo-Json -Depth 10
    
    try {
        Write-Host "Enviando para KIMI..." -ForegroundColor Yellow -NoNewline
        $response = Invoke-RestMethod -Uri $ApiUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 15
        Write-Host " OK!" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "`nERRO: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Se tem mensagem, envia e sai
if ($Message) {
    Write-Host "Voce: $Message" -ForegroundColor Cyan
    $result = Send-ToKimi -Text $Message
    if ($result) {
        Write-Host "KIMI: $result" -ForegroundColor White
    }
    exit
}

# Modo interativo
Write-Host "=== KIMI CHAT TERMINAL ===" -ForegroundColor Cyan
Write-Host "Fale com KIMI em portugues natural" -ForegroundColor Gray
Write-Host "Digite 'sair' para encerrar" -ForegroundColor Gray
Write-Host ""

while ($true) {
    $input = Read-Host "Voce"
    
    if ($input -eq "sair") {
        Write-Host "Ate logo!" -ForegroundColor Green
        break
    }
    
    if ([string]::IsNullOrWhiteSpace($input)) {
        continue
    }
    
    $result = Send-ToKimi -Text $input
    if ($result) {
        Write-Host "KIMI: $result" -ForegroundColor White
    }
    Write-Host ""
}
