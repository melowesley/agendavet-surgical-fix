# AgendaVet Dashboard Test
# Execute: .\test-dashboard.ps1

Write-Host "=== AGENDAVET DASHBOARD ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Verificar servidor
Write-Host "1. Verificando servidor..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 | Out-Null
    Write-Host "   Servidor OK" -ForegroundColor Green
}
catch {
    Write-Host "   Servidor OFFLINE" -ForegroundColor Red
    Write-Host "   Inicie com: npm run dev" -ForegroundColor Yellow
    exit
}

# Test 2: Verificar API KIMI
Write-Host "2. Testando API KIMI..." -ForegroundColor Yellow
try {
    $body = @{
        messages = @(@{
            role = "user"
            parts = @(@{ type = "text"; text = "Oi KIMI!" })
        })
        model = "kimi"
        mode = "admin"
    } | ConvertTo-Json -Depth 10

    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10
    Write-Host "   KIMI OK" -ForegroundColor Green
    Write-Host ""
    Write-Host "Resposta da KIMI:" -ForegroundColor Magenta
    Write-Host $response -ForegroundColor White
}
catch {
    Write-Host "   KIMI ERRO: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== PRONTO PARA USAR ===" -ForegroundColor Green
Write-Host ""
Write-Host "Para conversar com KIMI:" -ForegroundColor Yellow
Write-Host "   .\kimi-natural.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "Exemplos:" -ForegroundColor Yellow
Write-Host "   KIMI me ajude a organizar os pacientes" -ForegroundColor Gray
Write-Host "   Quantos pets temos na clinica?" -ForegroundColor Gray
Write-Host "   Liste os veterinarios do sistema" -ForegroundColor Gray
