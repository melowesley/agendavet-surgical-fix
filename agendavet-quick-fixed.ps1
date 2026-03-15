# AgendaVet Quick Dashboard - Versão Corrigida
# Executa: .\agendavet-quick-fixed.ps1

param(
    [string]$ClientId = "",
    [switch]$Today = $false
)

# Configuração
$ApiUrl = "http://localhost:3000/api/chat"
$SupabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$SupabaseKey = $env:SUPABASE_SERVICE_ROLE_KEY

# Cores
$colors = @{
    title = "Cyan"
    data = "White"
    success = "Green"
    warning = "Yellow"
    danger = "Red"
    info = "Blue"
}

# Função para buscar dados
function Get-Data {
    param([string]$Table, [string]$Filter = "")
    
    $url = "$SupabaseUrl/rest/v1/$Table"
    if ($Filter) {
        $url += "?$Filter"
    }
    
    try {
        $headers = @{
            "apikey" = $SupabaseKey
            "Authorization" = "Bearer $SupabaseKey"
        }
        return Invoke-RestMethod -Uri $url -Headers $headers -Method Get
    }
    catch {
        return $null
    }
}

# Função para analisar com IA
function Invoke-KimiAnalysis {
    param([string]$Question)
    
    $body = @{
        messages = @(@{
            role = "user"
            parts = @(@{ type = "text"; text = $Question })
        })
        model = "kimi"
        mode = "admin"
    } | ConvertTo-Json -Depth 10
    
    try {
        return Invoke-RestMethod -Uri $ApiUrl -Method Post -Body $body -ContentType "application/json"
    }
    catch {
        return "Erro ao conectar com KIMI"
    }
}

# Banner
Clear-Host
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor $colors.title
Write-Host "║                 AGENDAVET QUICK DASHBOARD              ║" -ForegroundColor $colors.title
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor $colors.title
Write-Host ""

# Estatísticas básicas
Write-Host "ESTATISTICAS DO SISTEMA" -ForegroundColor $colors.info
Write-Host ""

$pets = Get-Data -Table "pets"
$owners = Get-Data -Table "profiles"
$appointments = Get-Data -Table "appointments"

if ($pets -and $owners -and $appointments) {
    Write-Host "   Pacientes: $($pets.Count)" -ForegroundColor $colors.data
    Write-Host "   Donos: $($owners.Count)" -ForegroundColor $colors.data
    Write-Host "   Consultas: $($appointments.Count)" -ForegroundColor $colors.data
    
    # Hoje
    if ($Today) {
        $todayApts = $appointments | Where-Object { 
            $_.created_at -and [datetime]::Parse($_.created_at).Date -eq (Get-Date).Date 
        }
        Write-Host "   Consultas hoje: $($todayApts.Count)" -ForegroundColor $colors.success
    }
    
    # Por espécie
    $species = $pets | Group-Object species | Sort-Object Count -Descending
    Write-Host ""
    Write-Host "   Top especies:" -ForegroundColor $colors.info
    $species | Select-Object -First 3 | ForEach-Object {
        $name = if ($_.Name) { $_.Name } else { "Nao informado" }
        Write-Host "      • $name`: $($_.Count)" -ForegroundColor $colors.data
    }
}

Write-Host ""

# Análise específica do cliente
if ($ClientId) {
    Write-Host "ANALISE DO CLIENTE: $ClientId" -ForegroundColor $colors.info
    Write-Host ""
    
    $clientData = $owners | Where-Object { $_.id -eq $ClientId }
    if ($clientData) {
        $clientPets = $pets | Where-Object { $_.user_id -eq $ClientId }
        $clientApts = $appointments | Where-Object { $_.pet_id -in $clientPets.id }
        
        Write-Host "   Nome: $($clientData.full_name)" -ForegroundColor $colors.data
        Write-Host "   Pacientes: $($clientPets.Count)" -ForegroundColor $colors.data
        Write-Host "   Consultas: $($clientApts.Count)" -ForegroundColor $colors.data
        
        if ($clientPets) {
            Write-Host ""
            Write-Host "   Pets do cliente:" -ForegroundColor $colors.info
            $clientPets | ForEach-Object {
                Write-Host "      • $($_.name) ($($_.species))" -ForegroundColor $colors.data
            }
        }
        
        # Análise com KIMI
        Write-Host ""
        Write-Host "ANALISE DA IA:" -ForegroundColor $colors.warning
        Write-Host ""
        
        $question = "Analise o cliente $($clientData.full_name) que tem $($clientPets.Count) pets e $($clientApts.Count) consultas. De insights sobre o padrao de uso e sugestoes."
        $insight = Invoke-KimiAnalysis -Question $question
        
        Write-Host $insight -ForegroundColor $colors.data
    }
    else {
        Write-Host "Cliente nao encontrado" -ForegroundColor $colors.danger
    }
}
else {
    # Insights gerais com KIMI
    Write-Host "INSIGHTS DA IA" -ForegroundColor $colors.warning
    Write-Host ""
    
    $context = "Sistema AgendaVet com $($pets.Count) pacientes, $($owners.Count) donos, $($appointments.Count) consultas."
    
    $questions = @(
        "Qual e o perfil tipico dos pacientes do sistema?",
        "Existe algum padrao interessante nos dados?",
        "Quais sao as principais estatisticas que voce destaca?"
    )
    
    $question = $questions | Get-Random
    Write-Host "Pergunta: $question" -ForegroundColor $colors.info
    Write-Host ""
    
    $fullQuestion = "$context`n`n$question"
    $response = Invoke-KimiAnalysis -Question $fullQuestion
    
    Write-Host $response -ForegroundColor $colors.data
}

Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $colors.title
Write-Host ""
Write-Host "Para analise especifica:" -ForegroundColor $colors.info
Write-Host "   .\agendavet-quick-fixed.ps1 -ClientId uuid-do-cliente" -ForegroundColor $colors.data
Write-Host "   .\agendavet-quick-fixed.ps1 -Today" -ForegroundColor $colors.data
Write-Host ""
