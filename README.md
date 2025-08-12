# Backend - Pesquisa de Mercado

Backend completo para o sistema de pesquisa de mercado da G2 Telecom, desenvolvido com Node.js, TypeScript, Express e PostgreSQL, com integração à API Evolution para envio de mensagens WhatsApp.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação
- **Express** - Framework web
- **PostgreSQL** - Banco de dados
- **Prisma ORM** - ORM para TypeScript
- **Evolution API** - Integração WhatsApp
- **Joi** - Validação de dados
- **Helmet** - Segurança
- **CORS** - Cross-origin resource sharing
- **Morgan** - Logging
- **Rate Limiting** - Proteção contra spam

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── lib/
│   │   └── prisma.ts            # Cliente Prisma
│   ├── controllers/
│   │   └── pesquisaController.ts # Controladores da API
│   ├── middleware/
│   │   └── validation.ts        # Validação com Joi
│   ├── routes/
│   │   └── pesquisaRoutes.ts    # Rotas da API
│   ├── services/
│   │   ├── evolutionService.ts  # Serviço WhatsApp
│   │   └── pesquisaService.ts   # Lógica de negócio
│   ├── types/
│   │   └── index.ts             # Tipos TypeScript
│   └── server.ts                # Servidor principal
├── prisma/
│   ├── schema.prisma            # Schema do banco
│   └── seed.ts                  # Dados de exemplo
├── package.json
├── tsconfig.json
├── env.example
└── README.md
```

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

4. **Configure o arquivo .env**
```env
# Configurações do Servidor
PORT=3001
NODE_ENV=development

# Configurações do Banco de Dados PostgreSQL
DATABASE_URL="postgresql://postgres:sua_senha_aqui@localhost:5432/pesquisa_mercado?schema=public"

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

5. **Configure o PostgreSQL**
```sql
-- Criar banco de dados
CREATE DATABASE pesquisa_mercado;

-- Criar usuário (opcional)
CREATE USER pesquisa_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE pesquisa_mercado TO pesquisa_user;
```

6. **Configure o Prisma**
```bash
# Gerar cliente Prisma
npm run db:generate

# Sincronizar schema com o banco
npm run db:push

# (Opcional) Criar migration
npm run db:migrate

# (Opcional) Popular com dados de exemplo
npm run db:seed
```

## 🚀 Executando o Projeto

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

### Outros comandos
```bash
npm run lint          # Verificar código
npm run lint:fix      # Corrigir problemas de lint
npm test             # Executar testes
npm run db:studio    # Abrir Prisma Studio
```

## 📊 Endpoints da API

### Health Check
```
GET /api/health
```

### Pesquisas
```
POST   /api/pesquisas                    # Criar nova pesquisa
GET    /api/pesquisas                    # Listar todas as pesquisas
GET    /api/pesquisas/:id                # Buscar pesquisa por ID
GET    /api/pesquisas/bairro/:bairro     # Buscar pesquisas por bairro
```

### Estatísticas
```
GET    /api/estatisticas                 # Obter estatísticas gerais
```

## 📝 Exemplo de Uso

### Criar Nova Pesquisa
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
    "uso_internet": "Trabalho, Netflix, jogos",
    "interesse_proposta": "Sim, tenho interesse"
  }'
```

### Obter Estatísticas
```bash
curl http://localhost:3001/api/estatisticas
```

## 🔧 Configuração da Evolution API

1. **Instale a Evolution API** seguindo a documentação oficial
2. **Configure uma instância** do WhatsApp
3. **Obtenha a API Key** e URL da instância
4. **Configure as variáveis de ambiente** no arquivo .env

### Exemplo de configuração Evolution API:
```env
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=sua_api_key_aqui
EVOLUTION_INSTANCE=sua_instancia_aqui
EMPRESA_WHATSAPP=5511999999999
```

## 🛡️ Segurança

- **Helmet** - Headers de segurança
- **Rate Limiting** - Proteção contra spam
- **CORS** - Controle de origem
- **Validação** - Validação de entrada com Joi
- **SQL Injection** - Proteção com prepared statements

## 📊 Banco de Dados

### Prisma ORM
O projeto utiliza o **Prisma ORM** para gerenciar o banco de dados, oferecendo:

- **Type Safety** - Tipos TypeScript automáticos
- **Migrations** - Controle de versão do banco
- **Query Builder** - API intuitiva para consultas
- **Studio** - Interface visual para o banco
- **Auto-complete** - IntelliSense completo

### Modelo: PesquisaMercado
```prisma
model PesquisaMercado {
  id                  Int      @id @default(autoincrement())
  nome                String   @db.VarChar(255)
  whatsapp            String   @unique @db.VarChar(20)
  provedor_atual      String   @db.VarChar(255)
  satisfacao          Satisfacao
  bairro              String   @db.VarChar(255)
  velocidade          String?  @db.VarChar(100)
  valor_mensal        String   @db.VarChar(100)
  uso_internet        String   @db.Text
  interesse_proposta  InteresseProposta
  created_at          DateTime @default(now())
  updated_at          DateTime @updatedAt

  @@map("pesquisas_mercado")
}
```

### Enums
```prisma
enum Satisfacao {
  MUITO_SATISFEITO    @map("Muito satisfeito")
  SATISFEITO          @map("Satisfeito")
  INSATISFEITO        @map("Insatisfeito")
  MUITO_INSATISFEITO  @map("Muito insatisfeito")
}

enum InteresseProposta {
  SIM_INTERESSE       @map("Sim, tenho interesse")
  NAO_INTERESSE       @map("Não tenho interesse")
}
```

### Comandos Prisma
```bash
# Gerar cliente
npm run db:generate

# Sincronizar schema
npm run db:push

# Criar migration
npm run db:migrate

# Abrir Prisma Studio
npm run db:studio

# Popular dados
npm run db:seed
```

## 🔍 Monitoramento

### Logs
- **Morgan** - Logs de requisições HTTP
- **Console** - Logs de aplicação
- **Error Handling** - Tratamento de erros global

### Health Check
```bash
curl http://localhost:3001/api/health
```

## 🚀 Deploy

### Docker (opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/server.js"]
```

### Variáveis de Produção
```env
NODE_ENV=production
PORT=3001
DB_HOST=seu_host_producao
DB_PASSWORD=sua_senha_producao
EVOLUTION_API_URL=sua_url_producao
```

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento

## 📄 Licença

Este projeto é propriedade da G2 Telecom.
