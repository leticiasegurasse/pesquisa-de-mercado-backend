# Estágio de build
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Copiar código fonte
COPY src/ ./src/

# Compilar TypeScript
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS production

# Instalar dumb-init para gerenciamento de processos
RUN apk add --no-cache dumb-init

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar arquivos compilados do estágio de build
COPY --from=builder /app/dist ./dist

# Copiar arquivo de configuração de ambiente (se necessário)
COPY config.env ./

# Alterar propriedade dos arquivos para o usuário nodejs
RUN chown -R nodejs:nodejs /app

# Mudar para usuário não-root
USER nodejs

# Expor porta
EXPOSE 3000

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Usar dumb-init para gerenciar o processo Node.js
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]
