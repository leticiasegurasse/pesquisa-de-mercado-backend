# 🐳 Docker Setup - Backend

## 📋 Visão Geral

Este documento explica como configurar e executar o backend usando Docker.

## 🔧 Correções Implementadas

### **1. Erros de TypeScript Corrigidos**
- ✅ Adicionado `npx prisma generate` no Dockerfile
- ✅ Corrigidos tipos implícitos no `prisma.ts`
- ✅ Corrigidos tipos implícitos no `pesquisaService.ts`
- ✅ Criado `.dockerignore` para otimização

### **2. Dockerfile Atualizado**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Gerar Prisma Client antes do build
RUN npx prisma generate

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/server.js"]
```

## 🚀 Como Usar

### **1. Build Local**
```bash
cd backend

# Gerar Prisma Client primeiro
npx prisma generate

# Build da imagem
docker build -t pesquisa-mercado-backend .
```

### **2. Executar Container**
```bash
# Executar com variáveis de ambiente
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://postgres:adminpostgres@localhost:5432/pesquisa-mercado?sslmode=disable" \
  -e NODE_ENV=production \
  pesquisa-mercado-backend
```

### **3. Usar Script Automatizado**
```bash
# Dar permissão de execução
chmod +x build-docker.sh

# Executar script
./build-docker.sh
```

## 🔍 Troubleshooting

### **Erro: Prisma Client não encontrado**
```bash
# Solução: Gerar Prisma Client
npx prisma generate
```

### **Erro: Tipos TypeScript**
```bash
# Solução: Verificar se o build está funcionando
npm run build
```

### **Erro: Conexão com Banco**
```bash
# Verificar se o PostgreSQL está rodando
# Verificar DATABASE_URL no container
docker exec -it <container_id> env | grep DATABASE_URL
```

## 📊 Variáveis de Ambiente

### **Obrigatórias**
- `DATABASE_URL` - URL do PostgreSQL
- `NODE_ENV` - Ambiente (development/production)

### **Opcionais**
- `PORT` - Porta do servidor (padrão: 3001)
- `EVOLUTION_API_URL` - URL da API Evolution
- `EVOLUTION_API_KEY` - Chave da API Evolution
- `EVOLUTION_INSTANCE` - Instância da Evolution
- `EMPRESA_WHATSAPP` - WhatsApp da empresa

## 🐛 Logs e Debug

### **Ver Logs do Container**
```bash
docker logs <container_id>
```

### **Executar Container Interativo**
```bash
docker run -it --rm pesquisa-mercado-backend sh
```

### **Verificar Arquivos no Container**
```bash
docker exec -it <container_id> ls -la
```

## 📈 Otimizações

### **1. Multi-stage Build (Futuro)**
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3001
CMD ["node", "dist/server.js"]
```

### **2. Health Check**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1
```

## 🎯 Próximos Passos

1. **Testar build** com as correções
2. **Configurar CI/CD** para build automático
3. **Implementar multi-stage build** para otimização
4. **Adicionar health checks** para monitoramento
