# AgendaVet Dashboard - Terminal Interativo
# Executa: .\agendavet-dashboard.ps1
# Mostra estatísticas do sistema em tempo real com IA

param(
    [switch]$AutoRefresh = $false,
    [int]$RefreshInterval = 30,
    [string]$Model = "kimi"
)

# Configuração
$ApiUrl = "http://localhost:3000/api/chat"
$SupabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$SupabaseKey = $env:SUPABASE_SERVICE_ROLE_KEY

# Cores para o dashboard
$colors = @{
    title = "Cyan"
    header = "Yellow"
    success = "Green"
    warning = "Yellow"
    danger = "Red"
    info = "Blue"
    data = "White"
    prompt = "Magenta"
}

# Função para buscar dados do Supabase
function Get-SupabaseData {
    param([string]$Table, [string]$Select = "*", [string]$Filter = "")
    
    $url = "$SupabaseUrl/rest/v1/$Table?select=$Select"
    if ($Filter) {
        $url += "&$Filter"
    }
    
    try {
        $headers = @{
            "apikey" = $SupabaseKey
            "Authorization" = "Bearer $SupabaseKey"
        }
        
        $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
        return $response
    }
    catch {
        Write-Host "❌ Erro ao buscar dados de $Table`: $($_.Exception.Message)" -ForegroundColor $colors.danger
        return $null
    }
}

# Função para analisar com IA
function Ask-AI {
    param([string]$Question, [string]$Context = "")
    
    $prompt = if ($Context) {
        "Baseado nestes dados do sistema AgendaVet:`n$Context`n`nPergunta: $Question"
    } else {
        $Question
    }
    
    $body = @{
        messages = @(
            @{
                role = "user"
                parts = @(
                    @{
                        type = "text"
                        text = $prompt
                    }
                )
            }
        )
        model = $Model
        mode = "admin"
        temperature = 0.3
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri $ApiUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 15
        return $response
    }
    catch {
        Write-Host "❌ Erro na IA: $($_.Exception.Message)" -ForegroundColor $colors.danger
        return "Não foi possível conectar com a IA"
    }
}

# Função para mostrar banner
function Show-Banner {
    Clear-Host
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor $colors.title
    Write-Host "║                    🏥 AGENDAVET DASHBOARD                 ║" -ForegroundColor $colors.title
    Write-Host "║              Sistema Veterinário Inteligente               ║" -ForegroundColor $colors.title
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor $colors.title
    Write-Host ""
    Write-Host "📊 Estatísticas em tempo real | 🤖 IA: $Model | 🔄 Atualização: $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor $colors.info
    Write-Host "─────────────────────────────────────────────────────────────────" -ForegroundColor $colors.header
    Write-Host ""
}

# Função para mostrar estatísticas básicas
function Show-BasicStats {
    Write-Host "📋 ESTATÍSTICAS GERAIS" -ForegroundColor $colors.header
    Write-Host ""
    
    # Buscar dados
    $pets = Get-SupabaseData -Table "pets" -Select "id,name,species,type,created_at"
    $owners = Get-SupabaseData -Table "profiles" -Select "id,full_name,created_at"
    $appointments = Get-SupabaseData -Table "appointments" -Select "id,pet_id,status,created_at"
    
    if ($pets -and $owners -and $appointments) {
        $totalPets = $pets.Count
        $totalOwners = $owners.Count
        $totalAppointments = $appointments.Count
        $todayAppointments = ($appointments | Where-Object { $_.created_at -and [datetime]::Parse($_.created_at).Date -eq (Get-Date).Date }).Count
        
        Write-Host "   🐕 Pacientes: $totalPets" -ForegroundColor $colors.data
        Write-Host "   👥 Donos: $totalOwners" -ForegroundColor $colors.data
        Write-Host "   📅 Consultas: $totalAppointments (hoje: $todayAppointments)" -ForegroundColor $colors.data
        Write-Host ""
        
        # Estatísticas por espécie
        $speciesGroups = $pets | Group-Object species | Sort-Object Count -Descending
        Write-Host "   🦊 Pacientes por espécie:" -ForegroundColor $colors.info
        foreach ($group in $speciesGroups | Select-Object -First 5) {
            $speciesName = if ($group.Name) { $group.Name } else { "Não informado" }
            Write-Host "      • $speciesName`: $($group.Count)" -ForegroundColor $colors.data
        }
    }
    else {
        Write-Host "   ⚠️  Não foi possível carregar as estatísticas" -ForegroundColor $colors.warning
    }
    
    Write-Host ""
}

# Função para mostrar atividades recentes
function Show-RecentActivity {
    Write-Host "🕘 ATIVIDADES RECENTES" -ForegroundColor $colors.header
    Write-Host ""
    
    $appointments = Get-SupabaseData -Table "appointments" -Select "id,pet_id,status,created_at" -Filter "order=created_at.desc&limit=5"
    
    if ($appointments) {
        foreach ($apt in $appointments) {
            $date = if ($apt.created_at) { [datetime]::Parse($apt.created_at).ToString("dd/MM HH:mm") } else { "Data desconhecida" }
            $status = switch ($apt.status) {
                "scheduled" { "Agendado" }
                "completed" { "Concluído" }
                "cancelled" { "Cancelado" }
                default { $apt.status }
            }
            Write-Host "   📋 Consulta #$($apt.id.Substring(0,8)) - $status - $date" -ForegroundColor $colors.data
        }
    }
    else {
        Write-Host "   📭 Sem atividades recentes" -ForegroundColor $colors.info
    }
    
    Write-Host ""
}

# Função para mostrar insights da IA
function Show-AIInsights {
    Write-Host "🤖 INSIGHTS DA IA" -ForegroundColor $colors.header
    Write-Host ""
    
    # Buscar dados recentes
    $pets = Get-SupabaseData -Table "pets" -Select "name,species,created_at" -Filter "created_at=gte.$((Get-Date).AddDays(-7).ToString('yyyy-MM-dd'))"
    $appointments = Get-SubaseData -Table "appointments" -Select "id,status,created_at" -Filter "created_at=gte.$((Get-Date).AddDays(-1).ToString('yyyy-MM-dd'))"
    
    $context = ""
    if ($pets) {
        $context += "Novos pacientes esta semana: $($pets.Count)`n"
    }
    if ($appointments) {
        $completedToday = ($appointments | Where-Object { $_.status -eq "completed" }).Count
        $context += "Consultas concluídas hoje: $completedToday`n"
    }
    
    $questions = @(
        "Qual foi a espécie de animal mais atendida hoje?",
        "Existe algum padrão nos horários de agendamento?",
        "Quantos novos pacientes cadastramos esta semana?",
        "Qual o status geral das consultas de hoje?"
    )
    
    $question = $questions | Get-Random
    
    Write-Host "   🧠 Analisando: $question" -ForegroundColor $colors.prompt
    Write-Host "   ⏳ Processando..." -ForegroundColor $colors.warning -NoNewline
    
    $insight = Ask-AI -Question $question -Context $context
    
    Write-Host "`r   💡 " -ForegroundColor $colors.success
    Write-Host "   $insight" -ForegroundColor $colors.data
    Write-Host ""
}

# Função para mostrar menu interativo
function Show-InteractiveMenu {
    Write-Host "🎮 MENU INTERATIVO" -ForegroundColor $colors.header
    Write-Host ""
    Write-Host "   1️⃣  Análise detalhada de pacientes" -ForegroundColor $colors.data
    Write-Host "   2️⃣  Relatório de consultas do dia" -ForegroundColor $colors.data
    Write-Host "   3️⃣  Tempo médio de permanência no sistema" -ForegroundColor $colors.data
    Write-Host "   4️⃣  Doenças mais comuns por raça" -ForegroundColor $colors.data
    Write-Host "   5️⃣  Perguntar à IA (personalizado)" -ForegroundColor $colors.data
    Write-Host "   6️⃣  Atualizar dashboard" -ForegroundColor $colors.data
    Write-Host "   0️⃣  Sair" -ForegroundColor $colors.danger
    Write-Host ""
}

# Função para análise personalizada
function Ask-CustomQuestion {
    Write-Host ""
    Write-Host "💭 Digite sua pergunta para a IA:" -ForegroundColor $colors.prompt
    $question = Read-Host -Prompt "Pergunta"
    
    if ([string]::IsNullOrWhiteSpace($question)) {
        return
    }
    
    Write-Host "⏳ Analisando com IA..." -ForegroundColor $colors.warning -NoNewline
    
    # Buscar contexto relevante
    $pets = Get-SupabaseData -Table "pets" -Select "name,species,breed,created_at"
    $appointments = Get-SupabaseData -Table "appointments" -Select "id,status,created_at"
    
    $context = "Dados do sistema: $($pets.Count) pacientes, $($appointments.Count) consultas"
    
    $response = Ask-AI -Question $question -Context $context
    
    Write-Host "`r💡 " -ForegroundColor $colors.success
    Write-Host ""
    Write-Host $response -ForegroundColor $colors.data
    Write-Host ""
}

# Função principal
function Start-Dashboard {
    while ($true) {
        Show-Banner
        Show-BasicStats
        Show-RecentActivity
        Show-AIInsights
        Show-InteractiveMenu
        
        $choice = Read-Host -Prompt "Escolha uma opção"
        
        switch ($choice) {
            "1" {
                Write-Host ""
                Write-Host "🔍 Análise detalhada de pacientes..." -ForegroundColor $colors.info
                $analysis = Ask-AI -Question "Faça uma análise detalhada dos pacientes cadastrados, incluindo distribuição por espécie, raça e padrões de cadastro"
                Write-Host $analysis -ForegroundColor $colors.data
                Write-Host ""
                Read-Host "Pressione Enter para continuar"
            }
            "2" {
                Write-Host ""
                Write-Host "📊 Relatório de consultas do dia..." -ForegroundColor $colors.info
                $report = Ask-AI -Question "Gere um relatório completo das consultas de hoje, incluindo status, horários e qualquer padrão identificado"
                Write-Host $report -ForegroundColor $colors.data
                Write-Host ""
                Read-Host "Pressione Enter para continuar"
            }
            "3" {
                Write-Host ""
                Write-Host "⏱️  Analisando tempo de permanência..." -ForegroundColor $colors.info
                $timeAnalysis = Ask-AI -Question "Analise quanto tempo os clientes passam com o sistema aberto baseado nos timestamps de atividades"
                Write-Host $timeAnalysis -ForegroundColor $colors.data
                Write-Host ""
                Read-Host "Pressione Enter para continuar"
            }
            "4" {
                Write-Host ""
                Write-Host "🦴 Analisando doenças por raça..." -ForegroundColor $colors.info
                $diseaseAnalysis = Ask-AI -Question "Identifique as doenças mais comuns por raça de animal baseado nos dados disponíveis"
                Write-Host $diseaseAnalysis -ForegroundColor $colors.data
                Write-Host ""
                Read-Host "Pressione Enter para continuar"
            }
            "5" {
                Ask-CustomQuestion
                Read-Host "Pressione Enter para continuar"
            }
            "6" {
                continue
            }
            "0" {
                Write-Host ""
                Write-Host "👋 Dashboard encerrado!" -ForegroundColor $colors.success
                break
            }
            default {
                Write-Host "❌ Opção inválida!" -ForegroundColor $colors.danger
                Start-Sleep -Seconds 2
            }
        }
    }
}

# Verificar dependências
if (-not $SupabaseUrl -or -not $SupabaseKey) {
    Write-Host "❌ Configure as variáveis de ambiente:" -ForegroundColor $colors.danger
    Write-Host "   NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor $colors.warning
    Write-Host "   SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor $colors.warning
    Write-Host ""
    Write-Host "Ou execute no ambiente do projeto AgendaVet" -ForegroundColor $colors.info
    exit 1
}

# Iniciar dashboard
if ($AutoRefresh) {
    Write-Host "🔄 Dashboard com auto-refresh a cada $RefreshInterval segundos" -ForegroundColor $colors.info
    while ($true) {
        Start-Dashboard
        Start-Sleep -Seconds $RefreshInterval
    }
}
else {
    Start-Dashboard
}
