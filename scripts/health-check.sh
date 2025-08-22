#!/bin/sh

echo "🔍 Iniciando diagnóstico de saúde da aplicação..."
echo "=================================================="

# Verificar se o processo Node.js está rodando
echo "1. Verificando processo Node.js..."
if pgrep -f "node.*dist/server.js" > /dev/null; then
    echo "✅ Processo Node.js está rodando"
    ps aux | grep "node.*dist/server.js" | grep -v grep
else
    echo "❌ Processo Node.js não está rodando"
fi

echo ""

# Verificar se a porta 3000 está sendo usada
echo "2. Verificando porta 3000..."
if netstat -tuln | grep ":3000" > /dev/null; then
    echo "✅ Porta 3000 está em uso"
    netstat -tuln | grep ":3000"
else
    echo "❌ Porta 3000 não está em uso"
fi

echo ""

# Verificar conectividade com o banco de dados
echo "3. Verificando conectividade com banco de dados..."
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "DB_NAME: $DB_NAME"
echo "DB_USER: $DB_USER"

# Testar conexão com o banco
if command -v nc > /dev/null; then
    if nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
        echo "✅ Conexão com banco de dados está ativa"
    else
        echo "❌ Não foi possível conectar ao banco de dados"
    fi
else
    echo "⚠️  nc (netcat) não disponível para testar conexão"
fi

echo ""

# Verificar variáveis de ambiente críticas
echo "4. Verificando variáveis de ambiente..."
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "JWT_SECRET: ${JWT_SECRET:+'***configurado***'}"
echo "CORS_ORIGIN: $CORS_ORIGIN"

echo ""

# Verificar logs da aplicação
echo "5. Últimas linhas dos logs da aplicação..."
if [ -f /app/logs/app.log ]; then
    tail -20 /app/logs/app.log
else
    echo "⚠️  Arquivo de log não encontrado"
fi

echo ""

# Testar endpoint de health
echo "6. Testando endpoint de health..."
if command -v wget > /dev/null; then
    if wget --no-verbose --tries=1 --spider http://localhost:3000/api/health 2>/dev/null; then
        echo "✅ Endpoint /api/health está respondendo"
    else
        echo "❌ Endpoint /api/health não está respondendo"
    fi
else
    echo "⚠️  wget não disponível para testar endpoint"
fi

echo ""
echo "=================================================="
echo "🔍 Diagnóstico concluído"
