# AgendaVet Dashboard Simples
# Execute: .\dashboard.ps1

Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              🏥 AGENDAVET DASHBOARD                   ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar servidor
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
    Write-Host "✅ Servidor AgendaVet rodando" -ForegroundColor Green
}
catch {
    Write-Host "❌ Servidor nao encontrado em localhost:3000" -ForegroundColor Red
    Write-Host "   Inicie o servidor com: npm run dev" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📊 Conectando com KIMI..." -ForegroundColor Yellow

# Testar API KIMI
try {
    $body = @{
        messages = @(@{
            role = "user"
            parts = @(@{ type = "text"; text = "Oi KIMI, quantos pacientes temos no sistema?" })
        })
        model = "kimi"
        mode = "admin"
    } | ConvertTo-Json -Depth 10

    $kimiResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10
    
    Write-Host "✅ KIMI conectado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🤖 KIMI responde:" -ForegroundColor Magenta
    Write-Host $kimiResponse -ForegroundColor White
}
catch {
    Write-Host "❌ Erro ao conectar com KIMI: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Para usar o dashboard completo:" -ForegroundColor Yellow
Write-Host "   1. Configure as variaveis de ambiente do Supabase" -ForegroundColor Gray
Write-Host "   2. Execute: .\agendavet-dashboard.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "🗣️ Para conversar com KIMI:" -ForegroundColor Yellow
Write-Host "   .\kimi-natural.ps1" -ForegroundColor Gray
Write-Host ""
