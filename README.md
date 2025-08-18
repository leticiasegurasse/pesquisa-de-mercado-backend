# Pesquisa de Mercado - Backend API

API backend para sistema de pesquisa de mercado desenvolvida com Node.js, Express, TypeScript e PostgreSQL.

## 🚀 Deploy na Vercel

### Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Projeto no GitHub/GitLab/Bitbucket
3. Banco de dados PostgreSQL configurado

### Configuração das Variáveis de Ambiente

Na Vercel, configure as seguintes variáveis de ambiente:

```env
# Configurações do Servidor
PORT=3000
NODE_ENV=production

# Configurações do PostgreSQL
DB_HOST=seu_host_postgresql
DB_PORT=5432
DB_NAME=seu_banco_de_dados
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# Configurações JWT
JWT_SECRET=sua_chave_secreta_jwt_muito_segura
JWT_EXPIRES_IN=24h

# Configurações de CORS
CORS_ORIGIN=https://seu-frontend.vercel.app
```

### Passos para Deploy

1. **Conecte seu repositório à Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório do GitHub

2. **Configure o projeto:**
   - Framework Preset: `Node.js`
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Configure as variáveis de ambiente:**
   - Vá em Settings > Environment Variables
   - Adicione todas as variáveis listadas acima

4. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build e deploy

### Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   └── authController.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── models/
│   │   └── User.ts
│   ├── routes/
│   │   └── auth.ts
│   ├── types/
│   ├── utils/
│   │   └── jwt.ts
│   └── server.ts
├── config.env
├── package.json
├── tsconfig.json
├── vercel.json
└── README.md
```

### Scripts Disponíveis

- `npm run dev` - Executa o servidor em modo desenvolvimento
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Executa o servidor em produção
- `npm run vercel-build` - Script específico para build na Vercel

### Endpoints da API

- `GET /api/health` - Health check do servidor
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/profile` - Perfil do usuário (autenticado)

### Banco de Dados

O projeto utiliza PostgreSQL com Sequelize ORM. Certifique-se de que:

1. O banco de dados está acessível publicamente
2. As credenciais estão corretas
3. O banco de dados existe e está configurado

### Troubleshooting

**Erro de conexão com banco de dados:**
- Verifique se as variáveis de ambiente estão configuradas corretamente
- Confirme se o banco de dados está acessível
- Verifique se as credenciais estão corretas

**Erro de build:**
- Verifique se todas as dependências estão no `package.json`
- Confirme se o TypeScript está configurado corretamente
- Verifique se não há erros de sintaxe no código

**Erro de CORS:**
- Configure corretamente a variável `CORS_ORIGIN` com o domínio do frontend
- Verifique se o frontend está fazendo requisições para o domínio correto

### Suporte

Para dúvidas ou problemas, abra uma issue no repositório do projeto.
