
# API de Autenticação JWT

Uma API simples e robusta para autenticação de usuários usando JWT (JSON Web Tokens) com Node.js, Express, TypeScript e Sequelize.

## 🚀 Funcionalidades

- ✅ Registro de usuários
- ✅ Login com JWT
- ✅ Validação de dados
- ✅ Middleware de autenticação
- ✅ Tratamento de erros global
- ✅ Validação de senhas com bcrypt
- ✅ Tokens JWT seguros

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3001
JWT_SECRET=sua_chave_secreta_muito_segura
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nome_do_banco
DB_USER=usuario_do_banco
DB_PASS=senha_do_banco
NODE_ENV=development
```

4. Execute as migrações do banco de dados:
```bash
npx sequelize-cli db:migrate
```

5. Inicie o servidor:
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📚 Endpoints

### Base URL
```
http://localhost:3001/api
```

### 1. Registrar Usuário
**POST** `/auth/register`

**Body:**
```json
{
  "username": "usuario123",
  "password": "senha123",
  "email": "usuario@email.com" // opcional
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso!",
  "data": {
    "userId": 1,
    "username": "usuario123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Fazer Login
**POST** `/auth/login`

**Body:**
```json
{
  "username": "usuario123",
  "password": "senha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso!",
  "data": {
    "userId": 1,
    "username": "usuario123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Perfil do Usuário (Protegido)
**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Perfil acessado com sucesso!",
  "data": {
    "userId": 1,
    "username": "usuario123"
  }
}
```

## 🔐 Autenticação

Para acessar rotas protegidas, inclua o token JWT no header `Authorization`:

```
Authorization: Bearer <seu_token_jwt>
```

## 📝 Validações

### Registro
- Username: 3-50 caracteres, obrigatório
- Password: 6-255 caracteres, obrigatório
- Email: formato válido, opcional

### Login
- Username: obrigatório
- Password: obrigatório

## 🛡️ Segurança

- Senhas criptografadas com bcrypt (salt rounds: 12)
- Tokens JWT com expiração de 24 horas
- Headers de segurança com Helmet
- Validação de dados de entrada
- Tratamento de erros sem exposição de informações sensíveis

## 🏗️ Estrutura do Projeto

```
src/
├── config/
│   └── db.ts              # Configuração do banco de dados
├── controllers/
│   └── auth.controller.ts # Controladores de autenticação
├── middlewares/
│   ├── authMiddleware.ts  # Middleware de autenticação JWT
│   ├── errorMiddleware.ts # Tratamento de erros
│   ├── validationMiddleware.ts # Validação de dados
│   └── asyncMiddleware.ts # Middleware para funções assíncronas
├── models/
│   └── user.model.ts      # Modelo de usuário
├── routes/
│   └── auth.routes.ts     # Rotas de autenticação
└── server.ts              # Configuração do servidor
```

## 🧪 Testando a API

### Com cURL

**Registrar usuário:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "teste", "password": "123456", "email": "teste@email.com"}'
```

**Fazer login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "teste", "password": "123456"}'
```

**Acessar perfil (com token):**
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer <seu_token>"
```

### Com Postman

Importe a coleção `Milenio_Barros_Backend_API.postman_collection.json` para testar todos os endpoints.

## 🚀 Deploy

### Vercel
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Docker
```bash
docker build -t auth-api .
docker run -p 3001:3001 auth-api
```

## 📄 Licença

Este projeto está sob a licença ISC.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no repositório.
