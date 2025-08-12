#!/bin/bash

echo "🐳 Iniciando build do Docker..."

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker e tente novamente."
    exit 1
fi

# Gerar Prisma Client localmente primeiro
echo "🔧 Gerando Prisma Client..."
npx prisma generate

# Build da imagem
echo "🏗️ Construindo imagem Docker..."
docker build -t pesquisa-mercado-backend .

if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    echo "🚀 Para executar: docker run -p 3001:3001 pesquisa-mercado-backend"
else
    echo "❌ Erro no build do Docker"
    exit 1
fi
