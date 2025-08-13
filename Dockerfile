# =========================
# Estágio de build
# =========================
FROM node:18-alpine AS builder

# Diretório de trabalho
WORKDIR /app

# Copia apenas manifestos para otimizar cache
COPY package*.json ./

# Instala TODAS as dependências (inclui dev) para compilar TypeScript
RUN npm ci

# Copia o restante do código
COPY . .

# Compila TypeScript -> gera /app/dist
RUN npm run build



# =========================
# Estágio de produção
# =========================
FROM node:18-alpine AS production

ENV NODE_ENV=production

# Usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# Instala apenas dependências de produção
COPY package*.json ./
# Use --omit=dev para evitar o aviso do npm
RUN npm ci --omit=dev && npm cache clean --force

# Copia somente o build e configs necessários
COPY --from=builder /app/dist ./dist
COPY config.env ./

# Troca para usuário não-root
USER nodejs

# Porta exposta
EXPOSE 3001

# Healthcheck simples
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando de start
CMD ["node", "dist/server.js"]
