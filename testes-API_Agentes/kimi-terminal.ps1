# KIMI Chat Terminal - Com Suporte a Streaming
# Execute: .\kimi-terminal.ps1

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
        Write-Host "KIMI processando..." -ForegroundColor Yellow
        
        # Faz request e captura streaming
        $response = Invoke-RestMethod -Uri $ApiUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 20
        
        # Processa resposta streaming
        $lines = $response -split "`n"
        $fullText = ""
        
        foreach ($line in $lines) {
            if ($line.StartsWith("data: ")) {
                $data = $line.Substring(6)
                if ($data -eq "[DONE]") {
                    break
                }
                
                try {
                    $json = $data | ConvertFrom-Json
                    if ($json.type -eq "text") {
                        $fullText += $json.text
                        Write-Host $json.text -NoNewline -ForegroundColor White
                    }
                }
                catch {
                    # Ignora erros de parsing
                }
            }
        }
        
        Write-Host ""
        return $fullText
    }
    catch {
        Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Se tem mensagem, envia e sai
if ($Message) {
    Write-Host "Voce: $Message" -ForegroundColor Cyan
    Write-Host ""
    $result = Send-ToKimi -Text $Message
    if ($result) {
        Write-Host ""
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
    
    Write-Host ""
    $result = Send-ToKimi -Text $input
    Write-Host ""
}
