# 📚 Documentação da API - Pesquisa de Mercado

## 🚀 Base URL
```
http://localhost:3001/api
```

## 🔐 Autenticação

### Registrar Usuário
```http
POST /auth/register
```

**Body:**
```json
{
  "username": "usuario123",
  "password": "senha123",
  "email": "usuario@email.com"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso!",
  "data": {
    "user": {
      "id": 1,
      "username": "usuario123",
      "email": "usuario@email.com"
    },
    "token": "jwt_token_aqui"
  }
}
```

### Fazer Login
```http
POST /auth/login
```

**Body:**
```json
{
  "username": "usuario123",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso!",
  "data": {
    "user": {
      "id": 1,
      "username": "usuario123",
      "email": "usuario@email.com"
    },
    "token": "jwt_token_aqui"
  }
}
```

### Fazer Logout
```http
POST /auth/logout
```

### Renovar Token
```http
POST /auth/refresh
```

**Body:**
```json
{
  "refreshToken": "refresh_token_aqui"
}
```

### Esqueci a Senha
```http
POST /auth/forgot-password
```

**Body:**
```json
{
  "email": "usuario@email.com"
}
```

### Redefinir Senha
```http
POST /auth/reset-password
```

**Body:**
```json
{
  "token": "reset_token_aqui",
  "newPassword": "nova_senha123"
}
```

### Verificar Token (Protegido)
```http
GET /auth/verify-token
```

**Headers:**
```
Authorization: Bearer jwt_token_aqui
```

### Obter Perfil (Protegido)
```http
GET /auth/profile
```

**Headers:**
```
Authorization: Bearer jwt_token_aqui
```

### Atualizar Perfil (Protegido)
```http
PUT /auth/profile
```

**Headers:**
```
Authorization: Bearer jwt_token_aqui
```

**Body:**
```json
{
  "username": "novo_usuario",
  "email": "novo_email@email.com"
}
```

### Alterar Senha (Protegido)
```http
POST /auth/change-password
```

**Headers:**
```
Authorization: Bearer jwt_token_aqui
```

**Body:**
```json
{
  "currentPassword": "senha_atual",
  "newPassword": "nova_senha"
}
```

## 📊 Pesquisas

### Criar Pesquisa
```http
POST /pesquisas
```

**Body:**
```json
{
  "nome": "João Silva",
  "whatsapp": "11999999999",
  "cpf": "12345678901",
  "provedor_atual": "Vivo",
  "satisfacao": "satisfeito",
  "bairro": "Centro",
  "velocidade": "100 Mbps",
  "valor_mensal": "R$ 89,90",
  "uso_internet": "Trabalho, Estudo, Entretenimento",
  "interesse_proposta": "sim",
  "responsavel": "Maria"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Pesquisa criada com sucesso!",
  "data": {
    "id": 1,
    "nome": "João Silva",
    "whatsapp": "11999999999",
    "cpf": "12345678901",
    "provedor_atual": "Vivo",
    "satisfacao": "satisfeito",
    "bairro": "Centro",
    "velocidade": "100 Mbps",
    "valor_mensal": "R$ 89,90",
    "uso_internet": "Trabalho, Estudo, Entretenimento",
    "interesse_proposta": "sim",
    "responsavel": "Maria",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### Listar Pesquisas
```http
GET /pesquisas?page=1&limit=10&search=joão&bairro=centro&provedor_atual=vivo&satisfacao=satisfeito&interesse=sim&filtro_satisfacao=satisfeitos&filtro_interesse=interessados
```

**Parâmetros de Query:**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)
- `search`: Busca por nome, WhatsApp ou bairro
- `nome`: Filtrar por nome específico
- `bairro`: Filtrar por bairro
- `provedor_atual`: Filtrar por provedor
- `satisfacao`: Filtrar por satisfação
- `interesse`: Filtrar por interesse
- `filtro_satisfacao`: "satisfeitos" ou "insatisfeitos"
- `filtro_interesse`: "interessados" ou "nao_interessados"

### Buscar Apenas Interessados
```http
GET /pesquisas/interessados?page=1&limit=10
```

### Buscar Apenas Não Interessados
```http
GET /pesquisas/nao-interessados?page=1&limit=10
```

### Buscar Satisfeitos
```http
GET /pesquisas/satisfeitos?page=1&limit=10
```

### Buscar Insatisfeitos
```http
GET /pesquisas/insatisfeitos?page=1&limit=10
```

### Buscar por Nome
```http
GET /pesquisas/nome/joão?page=1&limit=10
```

### Buscar por Provedor
```http
GET /pesquisas/provedor/vivo?page=1&limit=10
```

### Buscar Pesquisa por ID
```http
GET /pesquisas/1
```

### Buscar Pesquisas por Bairro
```http
GET /pesquisas/bairro/centro
```

### Obter Estatísticas
```http
GET /pesquisas/estatisticas
```

**Resposta:**
```json
{
  "success": true,
  "message": "Estatísticas obtidas com sucesso",
  "data": {
    "total_pesquisas": 150,
    "por_satisfacao": {
      "muito_satisfeito": 30,
      "satisfeito": 45,
      "neutro": 25,
      "insatisfeito": 35,
      "muito_insatisfeito": 15
    },
    "por_interesse": {
      "sim": 100,
      "nao": 50
    },
    "provedores_mais_citados": [
      {
        "provedor": "Vivo",
        "quantidade": 45
      },
      {
        "provedor": "Claro",
        "quantidade": 35
      }
    ],
    "bairros_mais_pesquisados": [
      {
        "bairro": "Centro",
        "quantidade": 30
      },
      {
        "bairro": "Jardim",
        "quantidade": 25
      }
    ],
    "media_valor_mensal": "R$ 89,90",
    "interessados": 100,
    "nao_interessados": 50,
    "satisfeitos": 75,
    "insatisfeitos": 50
  }
}
```

### Verificar WhatsApp
```http
GET /pesquisas/verificar-whatsapp/11999999999
```

**Resposta:**
```json
{
  "success": true,
  "message": "WhatsApp disponível",
  "data": {
    "whatsapp": "11999999999",
    "jaExiste": false,
    "message": "Número disponível para cadastro"
  }
}
```

### Verificar CPF
```http
GET /pesquisas/verificar-cpf/12345678901
```

**Resposta:**
```json
{
  "success": true,
  "message": "CPF disponível",
  "data": {
    "cpf": "12345678901",
    "jaExiste": false,
    "message": "CPF disponível para cadastro"
  }
}
```

## 🏥 Sistema

### Health Check
```http
GET /health
```

**Resposta:**
```json
{
  "status": "OK",
  "message": "API funcionando corretamente",
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

## 📝 Códigos de Status HTTP

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Dados inválidos
- `401`: Não autorizado
- `404`: Não encontrado
- `409`: Conflito (dados duplicados)
- `500`: Erro interno do servidor

## 🔑 Autenticação JWT

Para rotas protegidas, inclua o header:
```
Authorization: Bearer seu_jwt_token_aqui
```

## 📋 Validações

### Usuário
- **username**: 3-50 caracteres
- **password**: mínimo 6 caracteres
- **email**: formato válido (opcional)

### Pesquisa
- **nome**: 2-100 caracteres
- **whatsapp**: formato válido (10-13 dígitos)
- **cpf**: formato válido (opcional)
- **provedor_atual**: máximo 50 caracteres
- **satisfacao**: "muito_satisfeito", "satisfeito", "neutro", "insatisfeito", "muito_insatisfeito"
- **bairro**: máximo 100 caracteres
- **valor_mensal**: máximo 20 caracteres
- **uso_internet**: obrigatório
- **interesse_proposta**: "sim" ou "nao"
- **responsavel**: máximo 100 caracteres

## 🚨 Tratamento de Erros

Todas as respostas seguem o padrão:
```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Código do erro (opcional)"
}
```

### Erros Específicos
- `WHATSAPP_DUPLICATE`: WhatsApp já cadastrado
- `CPF_DUPLICATE`: CPF já cadastrado
- `NETWORK_ERROR`: Erro de conexão
