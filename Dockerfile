FROM node:20-alpine

WORKDIR /app

# 🔧 Dependências de sistema necessárias para Prisma no Alpine
# - openssl1.1-compat: satisfaz libssl.so.1.1
# - libc6-compat: glibc shim para alguns binários
# - curl: para healthcheck (pode usar wget também)
RUN apk add --no-cache openssl1.1-compat libc6-compat curl

# Copia somente manifests para cache eficiente
COPY package*.json ./

# Instala todas as dependências (dev + prod) para poder buildar
RUN npm ci

# Copia schema do Prisma separadamente (melhor cache do generate)
COPY prisma ./prisma

# (Opcional mas recomendado) se você usar binaryTargets no schema.prisma,
# deixe o generate já preparar os engines corretos
RUN npx prisma generate

# Copia o restante do código
COPY . .

# Build da aplicação
RUN npm run build

# Remove dev deps e mantém apenas prod
RUN npm prune --omit=dev

ENV NODE_ENV=production
EXPOSE 3001

# Health check (usa curl, já instalado acima)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -fsS http://localhost:3001/api/health || exit 1

CMD ["node", "dist/server.js"]
