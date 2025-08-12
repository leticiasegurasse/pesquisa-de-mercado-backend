# 📊 API Pesquisa de Mercado - Documentação

## 🚀 Visão Geral

API REST para gerenciamento de pesquisas de mercado de provedores de internet, desenvolvida com Node.js, TypeScript, Express e PostgreSQL.

**Base URL:** `http://localhost:3001`

## 📋 Endpoints

### 1. Health Check

**GET** `/api/health`

Verifica se a API está funcionando corretamente.

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "API funcionando corretamente",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

---

### 2. Pesquisas

#### 2.1 Criar Nova Pesquisa

**POST** `/api/pesquisas`

Cria uma nova pesquisa de mercado.

**Body:**
```json
{
  "nome": "João Silva",
  "whatsapp": "(11) 99999-9999",
  "provedor_atual": "Vivo",
  "satisfacao": "Satisfeito",
  "bairro": "Centro",
  "velocidade": "100 Mbps",
  "valor_mensal": "R$ 89,90",
  "uso_internet": "Trabalho, Netflix, jogos online",
  "interesse_proposta": "Sim, tenho interesse"
}
```

**Valores Válidos para `satisfacao`:**
- `"Muito satisfeito"`
- `"Satisfeito"`
- `"Insatisfeito"`
- `"Muito insatisfeito"`

**Valores Válidos para `interesse_proposta`:**
- `"Sim, tenho interesse"`
- `"Não tenho interesse"`

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Pesquisa criada com sucesso",
  "data": {
    "id": 1,
    "nome": "João Silva",
    "whatsapp": "(11) 99999-9999",
    "provedor_atual": "Vivo",
    "satisfacao": "Satisfeito",
    "bairro": "Centro",
    "velocidade": "100 Mbps",
    "valor_mensal": "R$ 89,90",
    "uso_internet": "Trabalho, Netflix, jogos online",
    "interesse_proposta": "Sim, tenho interesse",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Erro - WhatsApp Duplicado (400):**
```json
{
  "success": false,
  "message": "Este número de WhatsApp já foi usado em uma pesquisa anterior"
}
```

#### 2.2 Listar Todas as Pesquisas

**GET** `/api/pesquisas`

Retorna todas as pesquisas cadastradas.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Pesquisas encontradas",
  "data": [
    {
      "id": 1,
      "nome": "João Silva",
      "whatsapp": "(11) 99999-9999",
      "provedor_atual": "Vivo",
      "satisfacao": "Satisfeito",
      "bairro": "Centro",
      "velocidade": "100 Mbps",
      "valor_mensal": "R$ 89,90",
      "uso_internet": "Trabalho, Netflix, jogos online",
      "interesse_proposta": "Sim, tenho interesse",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 2.3 Buscar Pesquisa por ID

**GET** `/api/pesquisas/:id`

Busca uma pesquisa específica pelo ID.

**Parâmetros:**
- `id` (number): ID da pesquisa

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Pesquisa encontrada",
  "data": {
    "id": 1,
    "nome": "João Silva",
    "whatsapp": "(11) 99999-9999",
    "provedor_atual": "Vivo",
    "satisfacao": "Satisfeito",
    "bairro": "Centro",
    "velocidade": "100 Mbps",
    "valor_mensal": "R$ 89,90",
    "uso_internet": "Trabalho, Netflix, jogos online",
    "interesse_proposta": "Sim, tenho interesse",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Erro - Não Encontrado (404):**
```json
{
  "success": false,
  "message": "Pesquisa não encontrada"
}
```

#### 2.4 Buscar Pesquisas por Bairro

**GET** `/api/pesquisas/bairro/:bairro`

Busca pesquisas por bairro específico.

**Parâmetros:**
- `bairro` (string): Nome do bairro

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Pesquisas encontradas",
  "data": [
    {
      "id": 1,
      "nome": "João Silva",
      "whatsapp": "(11) 99999-9999",
      "provedor_atual": "Vivo",
      "satisfacao": "Satisfeito",
      "bairro": "Centro",
      "velocidade": "100 Mbps",
      "valor_mensal": "R$ 89,90",
      "uso_internet": "Trabalho, Netflix, jogos online",
      "interesse_proposta": "Sim, tenho interesse",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 3. Estatísticas

#### 3.1 Obter Estatísticas

**GET** `/api/estatisticas`

Retorna estatísticas das pesquisas.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Estatísticas obtidas com sucesso",
  "data": {
    "total_pesquisas": 150,
    "por_satisfacao": {
      "Muito satisfeito": 25,
      "Satisfeito": 45,
      "Insatisfeito": 50,
      "Muito insatisfeito": 30
    },
    "por_interesse": {
      "Sim, tenho interesse": 120,
      "Não tenho interesse": 30
    },
    "provedores_mais_citados": [
      {
        "provedor": "Vivo",
        "quantidade": 45
      },
      {
        "provedor": "Claro",
        "quantidade": 35
      },
      {
        "provedor": "Oi",
        "quantidade": 25
      }
    ],
    "bairros_mais_pesquisados": [
      {
        "bairro": "Centro",
        "quantidade": 30
      },
      {
        "bairro": "Jardim América",
        "quantidade": 25
      }
    ],
    "media_valor_mensal": "R$ 95,50"
  }
}
```

---

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações do Servidor
PORT=3001
NODE_ENV=development

# Configurações do Banco de Dados PostgreSQL
DATABASE_URL="postgresql://postgres:adminpostgres@localhost:5432/pesquisa-mercado?sslmode=disable"

# Configurações da API Evolution (WhatsApp)
EVOLUTION_API_URL=https://sua-instancia.evolution-api.com
EVOLUTION_API_KEY=sua_api_key_aqui
EVOLUTION_INSTANCE=sua_instancia_aqui

# WhatsApp da empresa para receber notificações
EMPRESA_WHATSAPP=5511999999999

# Configurações de Segurança
JWT_SECRET=seu_jwt_secret_aqui
CORS_ORIGIN=http://localhost:5174

# Configurações de Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🚀 Como Usar

### 1. Instalação

```bash
cd backend
npm install
```

### 2. Configurar Banco de Dados

```bash
# Gerar cliente Prisma
npm run db:generate

# Sincronizar schema com o banco
npm run db:push

# Executar seed (opcional)
npm run db:seed
```

### 3. Executar o Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

---

## 📱 Integração com WhatsApp

A API integra automaticamente com a Evolution API para enviar notificações via WhatsApp quando uma nova pesquisa é criada.

**Formato da Mensagem:**
```
🔍 Nova Pesquisa de Mercado

👤 Nome: João Silva
📱 WhatsApp: (11) 99999-9999
🏢 Provedor Atual: Vivo
😊 Satisfação: Satisfeito
📍 Bairro: Centro
⚡ Velocidade: 100 Mbps
💰 Valor Mensal: R$ 89,90
💻 Uso: Trabalho, Netflix, jogos online
🎯 Interesse: Sim, tenho interesse

📊 Total de Pesquisas: 151
```

---

## 🛡️ Segurança

- **Rate Limiting**: 100 requisições por 15 minutos
- **CORS**: Configurado para origem específica
- **Helmet**: Headers de segurança
- **Validação**: Todos os dados são validados com Joi
- **Sanitização**: Dados são sanitizados antes de salvar

---

## 📊 Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `404` - Não encontrado
- `500` - Erro interno do servidor

---

## 🔍 Exemplos de Uso com cURL

### Health Check
```bash
curl -X GET http://localhost:3001/api/health
```

### Criar Pesquisa
```bash
curl -X POST http://localhost:3001/api/pesquisas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "whatsapp": "(11) 99999-9999",
    "provedor_atual": "Vivo",
    "satisfacao": "Satisfeito",
    "bairro": "Centro",
    "velocidade": "100 Mbps",
    "valor_mensal": "R$ 89,90",
    "uso_internet": "Trabalho, Netflix, jogos online",
    "interesse_proposta": "Sim, tenho interesse"
  }'
```

### Listar Pesquisas
```bash
curl -X GET http://localhost:3001/api/pesquisas
```

### Buscar por ID
```bash
curl -X GET http://localhost:3001/api/pesquisas/1
```

### Buscar por Bairro
```bash
curl -X GET http://localhost:3001/api/pesquisas/bairro/Centro
```

### Estatísticas
```bash
curl -X GET http://localhost:3001/api/estatisticas
```

---

## 📝 Notas Importantes

1. **WhatsApp Único**: Cada número de WhatsApp só pode ser usado uma vez
2. **Validação**: Todos os campos são obrigatórios exceto `velocidade`
3. **Formato WhatsApp**: Deve seguir o padrão `(XX) XXXXX-XXXX`
4. **Notificações**: WhatsApp é enviado automaticamente após criar pesquisa
5. **Logs**: Todas as operações são logadas no console

---

## 🐛 Troubleshooting

### Erro de Conexão com Banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Teste a conexão: `npm run db:push`

### Erro de WhatsApp
- Verifique as configurações da Evolution API
- Confirme se a instância está conectada
- Teste: `npm run dev` e verifique os logs

### Erro de Validação
- Verifique o formato dos dados enviados
- Confirme se todos os campos obrigatórios estão presentes
- Use os valores válidos para `satisfacao` e `interesse_proposta`
