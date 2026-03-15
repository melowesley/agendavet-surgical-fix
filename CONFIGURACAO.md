# CONFIGURAÇÃO DO AGENDAVET - PASSO A PASSO
# 
# INSTRUÇÕES:
# 1. Copie este conteúdo para AgendaVetWeb\.env.local
# 2. Substitua os valores "sua_chave_aqui" pelas suas chaves reais
# 3. Reinicie o servidor Next.js

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui  
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_aqui

# AI Model Providers
ANTHROPIC_API_KEY=sua_chave_anthropic_aqui
GOOGLE_API_KEY=sua_chave_google_aqui
DEEPSEEK_API_KEY=sua_chave_deepseek_aqui

# Kimi/Moonshot
KIMI_API_KEY=sua_chave_kimi_aqui
MOONSHOT_API_KEY=sua_chave_moonshot_aqui

# Default model
DEFAULT_MODEL=kimi

# ==========================================
# ONDE OBTER AS CHAVES:
#
# 1. SUPABASE:
#    - Vá para https://supabase.com
#    - Crie um projeto ou use um existente
#    - Settings > API > Copie URL e chaves
#
# 2. KIMI/MOONSHOT:
#    - Vá para https://platform.moonshot.cn
#    - Crie conta e obtenha API key
#
# 3. GOOGLE GEMINI:
#    - Vá para https://aistudio.google.com
#    - Crie API key gratuita
#
# 4. DEEPSEEK:
#    - Vá para https://platform.deepseek.com
#    - Crie conta e API key
#
# ==========================================
#
# DEPOIS DE CONFIGURAR:
# 1. Pare o servidor (Ctrl+C)
# 2. Reinicie com: npm run dev
# 3. Teste com: .\test-dashboard.ps1
# 4. Use o chat: .\kimi-simple.ps1
