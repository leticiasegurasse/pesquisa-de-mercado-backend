# ---------- STAGE 1: builder (compila TypeScript) ----------
FROM node:20-alpine AS builder

# Melhora caching do npm
ENV NODE_ENV=development
WORKDIR /app

# Instala dependências de build (necessário para bcryptjs)
RUN apk add --no-cache python3 make g++

# Copia manifestos antes para melhor cache
COPY package*.json ./

# Instala deps de dev para compilar TS
RUN npm ci

# Copia o resto do projeto
COPY tsconfig*.json ./
COPY src ./src

# Compila para JS
RUN npm run build

# ---------- STAGE 2: runner (produção, leve e seguro) ----------
FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# Instala somente deps de produção
COPY package*.json ./
RUN npm ci --omit=dev

# Copia artefatos compilados do builder
COPY --from=builder /app/dist ./dist
# Se seu app precisa de assets de runtime (ex: pastas public, views), copie também:
# COPY public ./public
# COPY views ./views

# Usuário não-root por segurança
USER node

# Porta do app (ajuste se precisar)
EXPOSE 3000

# Healthcheck para o EasyPanel (usa wget que já vem no alpine)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD sh -c "wget -qO- http://127.0.0.1:${PORT:-3000}/health || exit 1"


# Comando de inicialização
CMD ["node", "dist/server.js"]
