# Test API KIMI - Debug
param([string]$TestMessage = "Oi KIMI")

Write-Host "=== TESTE API KIMI ===" -ForegroundColor Cyan

# Test 1: Verificar se servidor responde
Write-Host "1. Testando servidor..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
    Write-Host "   Servidor OK" -ForegroundColor Green
}
catch {
    Write-Host "   Servidor OFFLINE" -ForegroundColor Red
    exit
}

# Test 2: Tentar diferentes formatos de request
Write-Host "2. Testando API com formato simples..." -ForegroundColor Yellow

# Formato 1: Mensagem simples
try {
    $body1 = @{
        messages = @(@{
            role = "user"
            content = $TestMessage
        })
        model = "kimi"
    } | ConvertTo-Json -Depth 10

    $response1 = Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -Body $body1 -ContentType "application/json" -TimeoutSec 10
    Write-Host "   Formato 1 OK: $($response1.Substring(0,50))..." -ForegroundColor Green
}
catch {
    Write-Host "   Formato 1 ERRO: $($_.Exception.Message)" -ForegroundColor Red
}

# Formato 2: Com parts
try {
    $body2 = @{
        messages = @(@{
            role = "user"
            parts = @(@{ type = "text"; text = $TestMessage })
        })
        model = "kimi"
        mode = "admin"
    } | ConvertTo-Json -Depth 10

    $response2 = Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -Body $body2 -ContentType "application/json" -TimeoutSec 10
    Write-Host "   Formato 2 OK: $($response2.Substring(0,50))..." -ForegroundColor Green
}
catch {
    Write-Host "   Formato 2 ERRO: $($_.Exception.Message)" -ForegroundColor Red
}

# Formato 3: Apenas model
try {
    $body3 = @{
        messages = @(@{
            role = "user"
            content = $TestMessage
        })
        model = "kimi"
        temperature = 0.7
    } | ConvertTo-Json -Depth 10

    $response3 = Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -Body $body3 -ContentType "application/json" -TimeoutSec 10
    Write-Host "   Formato 3 OK: $($response3.Substring(0,50))..." -ForegroundColor Green
}
catch {
    Write-Host "   Formato 3 ERRO: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== FIM DO TESTE ===" -ForegroundColor Cyan
