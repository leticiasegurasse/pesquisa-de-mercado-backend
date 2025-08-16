# Backend - Pesquisa de Mercado

Backend Node.js com TypeScript, Express, PostgreSQL e JWT para autenticação.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação
- **Express** - Framework web
- **PostgreSQL** - Banco de dados
- **Sequelize** - ORM
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Helmet** - Segurança
- **CORS** - Cross-Origin Resource Sharing

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL instalado e rodando
- npm ou yarn

## 🔧 Instalação

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
   
   **Para Desenvolvimento:**
   Copie o arquivo `config.env` e renomeie para `.env`, então configure suas variáveis.
   
   **Para Produção:**
   Use o arquivo `production.env.example` como base para criar seu `.env` de produção.

```bash
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações do PostgreSQL (VPS Hostinger)
DB_HOST=seu_host_postgres
DB_PORT=5432
DB_NAME=seu_nome_banco
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# Configurações do Pool de Conexões (Opcional)
DB_POOL_MAX=10
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000

# Configurações de Timeout (Opcional)
DB_STATEMENT_TIMEOUT=30000
DB_QUERY_TIMEOUT=30000
DB_CONNECT_TIMEOUT=30000
DB_LOCK_TIMEOUT=10000

# Logs do Banco (Opcional)
DB_LOGGING=false

# Configurações JWT
JWT_SECRET=sua_chave_secreta_jwt_muito_segura
JWT_EXPIRES_IN=24h

# Configurações de CORS
# Separe múltiplas origens por vírgula
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,https://pesquisa.sgr.dev.br,https://www.pesquisa.sgr.dev.br
```

## 🗄️ Configuração do Banco de Dados

1. **Crie um banco de dados PostgreSQL**
```sql
CREATE DATABASE pesquisa_mercado;
```

2. **Configure as credenciais no arquivo .env**

3. **O Sequelize criará as tabelas automaticamente na primeira execução**

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📡 Endpoints da API

### Autenticação

#### POST `/api/auth/register`
Registra um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@email.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/api/auth/login`
Faz login do usuário.

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
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@email.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
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
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@email.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Health Check

#### GET `/api/health`
Verifica se o servidor está funcionando.

**Response:**
```json
{
  "success": true,
  "message": "Servidor funcionando corretamente",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer <seu_token_jwt>
```

## 🛡️ Segurança

- Senhas são hasheadas com bcrypt
- Headers de segurança com Helmet
- CORS configurado
- Validação de entrada
- Tratamento de erros centralizado

## 🔧 Solução de Problemas

### Erro "out of shared memory" no PostgreSQL

Se você encontrar o erro `out of shared memory` em produção, isso indica que o PostgreSQL está esgotando a memória compartilhada para locks. O sistema agora inclui:

1. **Sincronização inteligente**: O sistema verifica se as tabelas existem antes de tentar sincronizar
2. **Criação manual de tabelas**: Se a sincronização falhar, o sistema cria as tabelas manualmente
3. **Configurações de pool otimizadas**: Use as variáveis `DB_POOL_*` para ajustar o pool de conexões
4. **Timeouts configuráveis**: Use as variáveis `DB_*_TIMEOUT` para ajustar timeouts
5. **Fallback robusto**: Múltiplas estratégias de recuperação em caso de erro

**Soluções adicionais no PostgreSQL:**

```sql
-- Aumentar max_locks_per_transaction
ALTER SYSTEM SET max_locks_per_transaction = 256;

-- Aumentar shared_buffers (se houver memória disponível)
ALTER SYSTEM SET shared_buffers = '256MB';

-- Reiniciar o PostgreSQL após as alterações
SELECT pg_reload_conf();
```

### Configurações Recomendadas para Produção

```bash
# Configurações otimizadas para produção
NODE_ENV=production
DB_POOL_MAX=5
DB_POOL_MIN=0
DB_POOL_ACQUIRE=60000
DB_POOL_IDLE=30000
DB_STATEMENT_TIMEOUT=60000
DB_QUERY_TIMEOUT=60000
DB_CONNECT_TIMEOUT=60000
DB_LOCK_TIMEOUT=30000
DB_LOGGING=false
```

### Configuração do PostgreSQL em Produção

1. **Execute o script de otimização:**
   ```bash
   # Conecte como superusuário
   sudo -u postgres psql
   
   # Execute o script de configuração
   \i fix-postgres-memory.sql
   ```

2. **Reinicie o PostgreSQL:**
   ```bash
   sudo systemctl restart postgresql
   ```

3. **Verifique as configurações:**
   ```sql
   SHOW max_locks_per_transaction;
   SHOW shared_buffers;
   SHOW work_mem;
   ```

### Solução Rápida para "Out of Shared Memory"

Se você estiver enfrentando o erro imediatamente, execute estes comandos no PostgreSQL:

```sql
-- Como superusuário (postgres)
ALTER SYSTEM SET max_locks_per_transaction = 256;
SELECT pg_reload_conf();
```

## 📁 Estrutura do Projeto

```
src/
├── config/
│   └── database.ts          # Configuração do banco de dados
├── controllers/
│   └── authController.ts    # Controllers de autenticação
├── middleware/
│   └── auth.ts             # Middleware de autenticação
├── models/
│   └── User.ts             # Modelo de usuário
├── routes/
│   └── auth.ts             # Rotas de autenticação
├── utils/
│   └── jwt.ts              # Utilitários JWT
└── server.ts               # Arquivo principal do servidor
```

## 🧪 Testando a API

Você pode usar ferramentas como:
- **Postman**
- **Insomnia**
- **Thunder Client** (VS Code)
- **curl**

### Exemplo com curl:

```bash
# Health check
curl http://localhost:3000/api/health

# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@email.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","password":"123456"}'

# Obter perfil (com token)
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <seu_token>"
```

## 🚀 Próximos Passos

- [ ] Adicionar validação com Joi ou Zod
- [ ] Implementar refresh tokens
- [ ] Adicionar rate limiting
- [ ] Implementar logs estruturados
- [ ] Adicionar testes unitários
- [ ] Configurar CI/CD
- [ ] Adicionar documentação com Swagger

## 📝 Licença

Este projeto está sob a licença ISC.
