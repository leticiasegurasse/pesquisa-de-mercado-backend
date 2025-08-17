# Backend de Autenticação

Backend completo com autenticação JWT usando Node.js, TypeScript, Sequelize e Express.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação
- **Express** - Framework web
- **Sequelize** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Joi** - Validação de dados
- **Helmet** - Segurança
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - Proteção contra ataques

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auth_db
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# Configurações JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=24h

# Configurações de Segurança
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. **Configure o banco de dados**
- Crie um banco PostgreSQL chamado `auth_db`
- Ou altere o nome no arquivo `.env`

5. **Execute as migrações (opcional)**
```bash
npm run migrate
```

## 🚀 Executando o projeto

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

### Docker

#### Build e execução simples
```bash
# Build da imagem
docker build -t backend-auth .

# Executar container
docker run -p 3000:3000 \
  -e DB_HOST=localhost \
  -e DB_PASSWORD=sua_senha \
  -e JWT_SECRET=seu_secret \
  backend-auth
```

#### Usando Docker Compose (recomendado)
```bash
# Executar com PostgreSQL incluído
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Parar serviços
docker-compose down
```

#### Script de teste automatizado
```bash
# Dar permissão de execução
chmod +x scripts/docker-build.sh

# Executar teste
./scripts/docker-build.sh
```

## 📚 API Endpoints

### Autenticação

#### POST `/api/auth/register`
Registra um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "message": "Usuário criado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@email.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/api/auth/login`
Realiza login do usuário.

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@email.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET `/api/auth/profile`
Obtém o perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Perfil recuperado com sucesso",
  "data": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "isActive": true,
    "lastLogin": "2024-01-01T10:00:00.000Z",
    "createdAt": "2024-01-01T09:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

#### GET `/api/auth/validate`
Valida o token JWT.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Token válido",
  "data": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

### Health Check

#### GET `/health`
Verifica o status da aplicação.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "environment": "development"
}
```

## 🔒 Segurança

- **Helmet**: Headers de segurança
- **CORS**: Configurado para desenvolvimento e produção
- **Rate Limiting**: Proteção contra ataques de força bruta
- **bcryptjs**: Hash seguro de senhas
- **JWT**: Tokens com expiração
- **Validação**: Validação de entrada com Joi

## 📁 Estrutura do Projeto

```
src/
├── config/
│   └── database.ts          # Configuração do Sequelize
├── controllers/
│   └── authController.ts    # Controllers de autenticação
├── middleware/
│   ├── auth.ts             # Middleware de autenticação JWT
│   ├── validation.ts       # Middleware de validação
│   └── errorHandler.ts     # Tratamento de erros
├── models/
│   └── User.ts             # Modelo de usuário
├── routes/
│   └── authRoutes.ts       # Rotas de autenticação
├── services/
│   └── authService.ts      # Lógica de negócio
├── app.ts                  # Configuração do Express
└── server.ts               # Servidor principal
```

## 🧪 Testes

```bash
npm test
```

## 📝 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm start` - Executa em modo produção
- `npm test` - Executa os testes
- `npm run migrate` - Executa migrações
- `npm run migrate:undo` - Reverte migrações
- `npm run seed` - Executa seeders

## 🔧 Configurações

### TypeScript
- Target: ES2020
- Module: CommonJS
- Strict mode habilitado
- Decorators habilitados

### Sequelize
- PostgreSQL como banco
- Timestamps automáticos
- Nomenclatura snake_case
- Pool de conexões configurado

### Express
- Rate limiting configurado
- CORS configurado
- Helmet para segurança
- Parsing de JSON limitado

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
