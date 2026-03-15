#!/bin/bash
# KIMI Chat - Terminal Client (Linux/macOS)
# Para usar: chmod +x kimi-chat.sh && ./kimi-chat.sh

API_URL="http://localhost:3000/api/chat"
SESSION_FILE="/tmp/kimi_session.json"

# Função para mostrar ajuda
show_help() {
    echo "🧠 KIMI Chat Client - Bash"
    echo ""
    echo "Uso:"
    echo "  ./kimi-chat.sh 'mensagem'                    # Envia mensagem única"
    echo "  ./kimi-chat.sh --brain                      # Modo KIMI Brain"
    echo "  ./kimi-chat.sh --saas                       # Modo KIMI Copilot SaaS"
    echo "  ./kimi-chat.sh                              # Modo interativo"
    echo ""
    echo "Parâmetros:"
    echo "  --brain     Ativa modo KIMI Brain"
    echo "  --saas      Ativa modo KIMI Copilot SaaS"
    echo "  --help      Mostra esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  ./kimi-chat.sh 'KIMI liste os pets'"
    echo "  ./kimi-chat.sh --brain 'KIMI melhore este texto'"
    echo "  ./kimi-chat.sh --saas '/agents list'"
}

# Função para enviar mensagem
send_message() {
    local text="$1"
    local mode="$2"
    local enable_brain="$3"
    local enable_saas="$4"
    
    local body=$(cat <<EOF
{
  "messages": [
    {
      "role": "user",
      "parts": [
        {
          "type": "text",
          "text": "$text"
        }
      ]
    }
  ],
  "model": "kimi",
  "mode": "$mode",
  "enableKimiBrain": $enable_brain,
  "enableKimiCopilotSaas": $enable_saas
}
EOF
)
    
    response=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "$body" \
        --connect-timeout 10 \
        --max-time 30)
    
    echo "$response"
}

# Parse argumentos
MESSAGE=""
MODE="admin"
ENABLE_BRAIN=false
ENABLE_SAAS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --brain)
            ENABLE_BRAIN=true
            MODE="kimi_brain"
            shift
            ;;
        --saas)
            ENABLE_SAAS=true
            MODE="kimi_copilot_saas"
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            if [[ -z "$MESSAGE" ]]; then
                MESSAGE="$1"
            fi
            shift
            ;;
    esac
done

# Se tem mensagem única
if [[ -n "$MESSAGE" ]]; then
    echo "🧠 Enviando para KIMI..."
    response=$(send_message "$MESSAGE" "$MODE" "$ENABLE_BRAIN" "$ENABLE_SAAS")
    if [[ -n "$response" ]]; then
        echo "✅ Resposta:"
        echo "$response"
    fi
    exit 0
fi

# Modo interativo
mode_name="Normal"
if [[ "$ENABLE_SAAS" == true ]]; then
    mode_name="KIMI Copilot SaaS"
elif [[ "$ENABLE_BRAIN" == true ]]; then
    mode_name="KIMI Brain"
fi

echo "🧠 KIMI Chat - Modo: $mode_name"
echo "Digite 'sair' para encerrar"
echo "───────────────────────────────────────"
echo ""

while true; do
    read -p "KIMI> " input
    
    if [[ "$input" == "sair" || "$input" == "exit" || "$input" == "quit" ]]; then
        echo "👋 Até logo!"
        break
    fi
    
    if [[ -z "$input" ]]; then
        continue
    fi
    
    # Detecta modo automaticamente
    current_mode="$MODE"
    current_enable_brain="$ENABLE_BRAIN"
    current_enable_saas="$ENABLE_SAAS"
    
    if [[ "$input" =~ ^KIMI\  ]]; then
        current_mode="kimi_brain"
        current_enable_brain=true
    elif [[ "$input" =~ copilot.*saas|agentvet ]]; then
        current_mode="kimi_copilot_saas"
        current_enable_saas=true
    fi
    
    echo -n "🤔 Processando..."
    response=$(send_message "$input" "$current_mode" "$current_enable_brain" "$current_enable_saas")
    
    if [[ -n "$response" ]]; then
        echo -e "\r✅ "
        echo ""
        echo "🤖 KIMI:"
        echo "$response"
        echo ""
    else
        echo -e "\r❌ Falha na comunicação"
    fi
done
