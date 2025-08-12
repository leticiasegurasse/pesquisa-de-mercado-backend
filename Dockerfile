FROM node:20-alpine

WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apk add --no-cache libc6-compat

COPY package*.json ./

RUN npm install

COPY . .

# Gerar Prisma Client antes do build
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Limpar dependências de desenvolvimento
RUN npm prune --production

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

CMD ["node", "dist/server.js"]

