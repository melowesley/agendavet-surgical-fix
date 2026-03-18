# KIMI Chat Local - Versão que funciona sem APIs externas
# Execute: .\kimi-local.ps1

param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string]$Message = ""
)

# Respostas simuladas para o KIMI
$kimiresponses = @{
    "oi" = "Olá! Sou KIMI, o assistente inteligente do AgendaVet. Como posso ajudar você hoje?"
    "ola" = "Olá! Sou KIMI, o assistente inteligente do AgendaVet. Como posso ajudar você hoje?"
    "tudo bem" = "Estou ótima! Pronta para ajudar com seu sistema veterinário. O que você precisa?"
    "quantos pacientes" = "Para verificar o número de pacientes, preciso acessar o banco de dados. Você pode configurar as variáveis de ambiente do Supabase para ter acesso completo."
    "pacientes" = "Para analisar os pacientes, preciso acessar os dados do sistema. Configure as chaves do Supabase para ter acesso completo."
    "doencas" = "Para analisar doenças por raça, preciso dos dados clínicos. Configure o Supabase para ter acesso às informações."
    "configurar" = "Para me configurar completamente, você precisa:
1. Configurar NEXT_PUBLIC_SUPABASE_URL
2. Configurar SUPABASE_SERVICE_ROLE_KEY  
3. Configurar KIMI_API_KEY
Depois eu poderei acessar todos os dados do sistema!"
    "ajuda" = "Sou KIMI, sua assistente do AgendaVet! Posso ajudar com:
• Análise de pacientes
• Estatísticas clínicas
• Relatórios do sistema
• Orquestração de outras IAs
Para acesso completo, configure as variáveis de ambiente."
    "sair" = "Até logo! Foi um prazer ajudar. Volte sempre que precisar!"
}

function Get-KimiResponse {
    param([string]$Input)
    
    $inputLower = $Input.ToLower()
    
    # Verificar "configurar" primeiro
    if ($inputLower -match "configurar|ambiente|variavel") {
        return $kimiresponses["configurar"]
    }
    
    # Procurar resposta exata
    foreach ($key in $kimiresponses.Keys) {
        if ($inputLower -match [regex]::Escape($key)) {
            return $kimiresponses[$key]
        }
    }
    
    # Respostas baseadas em palavras-chave
    if ($inputLower -match "paciente|pet|animal") {
        return "Para informações sobre pacientes, preciso acessar o banco de dados. Configure as variáveis do Supabase para ter acesso completo aos dados clínicos."
    }
    elseif ($inputLower -match "ajuda|help|comando") {
        return $kimiresponses["ajuda"]
    }
    elseif ($inputLower -match "tempo|permanencia|cliente") {
        return "Para analisar tempo de permanência dos clientes, preciso dos logs do sistema. Configure o Supabase para ter acesso aos dados de uso."
    }
    elseif ($inputLower -match "doenca|doença|raça") {
        return $kimiresponses["doencas"]
    }
    else {
        return "Sou KIMI do AgendaVet! Para acessar dados completos do sistema, configure as variáveis de ambiente do Supabase. Enquanto isso, posso ajudar com informações gerais sobre o sistema."
    }
}

# Se tem mensagem, envia e sai
if ($Message) {
    Write-Host "Você: $Message" -ForegroundColor Cyan
    $response = Get-KimiResponse -Input $Message
    Write-Host "KIMI: $response" -ForegroundColor White
    if ($Message.ToLower() -match "sair") {
        exit
    }
    exit
}

# Modo interativo
Write-Host "=== KIMI CHAT LOCAL ===" -ForegroundColor Cyan
Write-Host "Assistente do AgendaVet (modo offline)" -ForegroundColor Gray
Write-Host "Digite 'sair' para encerrar" -ForegroundColor Gray
Write-Host ""

while ($true) {
    $input = Read-Host "Você"
    
    if ($input -match "sair|exit|quit") {
        $response = Get-KimiResponse -Input "sair"
        Write-Host "KIMI: $response" -ForegroundColor White
        break
    }
    
    if ([string]::IsNullOrWhiteSpace($input)) {
        continue
    }
    
    $response = Get-KimiResponse -Input $input
    Write-Host "KIMI: $response" -ForegroundColor White
    Write-Host ""
}
