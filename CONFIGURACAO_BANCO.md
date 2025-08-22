# 🔧 Configuração do Banco de Dados

## 📋 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto backend com as seguintes variáveis:

### Opção 1: Usar DB_URL (Recomendado)
```env
# Configuração do Banco de Dados
DB_URL=postgres://usuario:senha@localhost:5432/pesquisa_mercado

# Configuração do JWT
JWT_SECRET=sua_chave_secreta_aqui

# Configuração do Ambiente
NODE_ENV=development
PORT=3001
```

### Opção 2: Usar Parâmetros Individuais
```env
# Configuração do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pesquisa_mercado
DB_USER=postgres
DB_PASSWORD=password

# Configuração do JWT
JWT_SECRET=sua_chave_secreta_aqui

# Configuração do Ambiente
NODE_ENV=development
PORT=3001
```

## 🚀 Exemplos de DB_URL

### PostgreSQL Local
```env
DB_URL=postgres://postgres:password@localhost:5432/pesquisa_mercado
```

### PostgreSQL com SSL
```env
DB_URL=postgres://usuario:senha@localhost:5432/pesquisa_mercado?sslmode=require
```

### PostgreSQL na Nuvem (ex: Heroku, Railway, etc.)
```env
DB_URL=postgres://usuario:senha@host:porta/pesquisa_mercado
```

## 📝 Como Criar o Arquivo .env

1. Na pasta `backend`, crie um arquivo chamado `.env`
2. Adicione as variáveis de ambiente conforme os exemplos acima
3. Substitua os valores pelos seus dados reais

## ✅ Verificação

Após configurar o `.env`, reinicie o servidor:

```bash
npm run dev
```

Se tudo estiver correto, você verá:
```
✅ Conectado ao banco de dados PostgreSQL
✅ Modelos sincronizados com o banco de dados
🚀 Servidor rodando na porta 3001
```

## 🔍 Troubleshooting

### Erro de Conexão
- Verifique se o PostgreSQL está rodando
- Confirme se as credenciais estão corretas
- Teste a conexão com: `psql -h localhost -U postgres -d pesquisa_mercado`

### Erro de Autenticação
- Verifique se o usuário e senha estão corretos
- Confirme se o usuário tem permissão para acessar o banco

### Erro de Banco Não Encontrado
- Crie o banco de dados: `CREATE DATABASE pesquisa_mercado;`
- Ou use um banco existente alterando o `DB_NAME`
