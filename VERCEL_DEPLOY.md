# 🚀 Deploy Rápido na Vercel

## 📋 Pré-requisitos

1. **Conta na Vercel**: [vercel.com](https://vercel.com)
2. **Banco PostgreSQL**: [Railway](https://railway.app) ou [Supabase](https://supabase.com)
3. **Código no GitHub**

## 🗄️ Configurar Banco de Dados

### Railway (Recomendado)
1. Acesse [railway.app](https://railway.app)
2. Crie conta e projeto
3. Adicione PostgreSQL
4. Copie as credenciais de conexão

## 🔧 Variáveis de Ambiente na Vercel

Configure estas variáveis no dashboard da Vercel:

```env
# Banco de Dados
DB_HOST=seu_host_railway_aqui
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=24h

# SSL (obrigatório para Railway)
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false

# Produção
NODE_ENV=production
```

## 🚀 Deploy

### Método 1: Via GitHub (Recomendado)
1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Clique em "New Project"
4. Importe o repositório
5. Configure as variáveis de ambiente
6. Clique em "Deploy"

### Método 2: Via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Para produção
vercel --prod
```

## ✅ Testar Deploy

Após o deploy, teste:

```bash
# Health check
curl https://seu-projeto.vercel.app/health

# Registro
curl -X POST https://seu-projeto.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@email.com","password":"123456"}'
```

## 🛠️ Troubleshooting

- **Erro de banco**: Verifique variáveis de ambiente
- **Erro de build**: Execute `npm run build` localmente
- **Timeout**: Aumente `maxDuration` no `vercel.json`

## 📁 Estrutura Final

```
├── src/
│   ├── api.ts              # ✅ Ponto de entrada Vercel
│   ├── app.ts              # ✅ Configuração Express
│   └── ...
├── vercel.json             # ✅ Configuração Vercel
├── .vercelignore           # ✅ Arquivos ignorados
└── env.vercel.example      # ✅ Exemplo variáveis
```
