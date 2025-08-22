# 📚 Guia de Uso da Coleção Postman

## 🚀 Como Importar a Coleção

1. **Abra o Postman**
2. **Clique em "Import"** (botão no canto superior esquerdo)
3. **Selecione o arquivo:** `Pesquisa_Mercado_API.postman_collection.json`
4. **Clique em "Import"**

## ⚙️ Configuração Inicial

### 1. Configurar Variáveis de Ambiente

Após importar, configure as variáveis:

1. **Clique no ícone de engrenagem** (⚙️) ao lado do nome da coleção
2. **Vá para a aba "Variables"**
3. **Configure as variáveis:**

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `base_url` | `http://localhost:3001` | URL base da API |
| `auth_token` | (deixar vazio) | Token de autenticação (será preenchido automaticamente) |
| `refresh_token` | (deixar vazio) | Token de refresh (será preenchido automaticamente) |
| `reset_token` | (deixar vazio) | Token para reset de senha |

### 2. Configurar Scripts Automáticos

Para facilitar o uso, adicione este script no **"Tests"** da requisição **"Fazer Login"**:

```javascript
// Script para capturar automaticamente o token após login
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.data && response.data.token) {
        pm.collectionVariables.set("auth_token", response.data.token);
        pm.collectionVariables.set("refresh_token", response.data.refreshToken);
        console.log("✅ Token capturado automaticamente!");
    }
}
```

## 📋 Estrutura da Coleção

### 🏥 Sistema
- **Health Check**: Verifica se a API está funcionando

### 🔐 Autenticação
- **Registrar Usuário**: Criar nova conta
- **Fazer Login**: Autenticar e obter token
- **Fazer Logout**: Encerrar sessão
- **Renovar Token**: Renovar token expirado
- **Esqueci a Senha**: Solicitar reset de senha
- **Redefinir Senha**: Definir nova senha
- **Verificar Token**: Validar token atual
- **Obter Perfil**: Buscar dados do usuário
- **Atualizar Perfil**: Modificar dados do usuário
- **Alterar Senha**: Trocar senha atual

### 📊 Pesquisas
- **Criar Pesquisa**: Adicionar nova pesquisa
- **Listar Pesquisas**: Buscar todas as pesquisas
- **Listar Pesquisas com Filtros**: Buscar com filtros específicos
- **Obter Estatísticas**: Dados estatísticos
- **Buscar Interessados**: Apenas interessados na proposta
- **Buscar Não Interessados**: Apenas não interessados
- **Buscar Satisfeitos**: Apenas satisfeitos
- **Buscar Insatisfeitos**: Apenas insatisfeitos
- **Buscar por Nome**: Filtrar por nome
- **Buscar por Provedor**: Filtrar por provedor
- **Buscar por Bairro**: Filtrar por bairro
- **Buscar Pesquisa por ID**: Buscar pesquisa específica
- **Verificar WhatsApp**: Verificar se WhatsApp já existe
- **Verificar CPF**: Verificar se CPF já existe

## 🔄 Fluxo de Teste Recomendado

### 1. Teste Inicial
```
🏥 Sistema → Health Check
```

### 2. Teste de Autenticação
```
🔐 Autenticação → Registrar Usuário
🔐 Autenticação → Fazer Login
🔐 Autenticação → Verificar Token
🔐 Autenticação → Obter Perfil
```

### 3. Teste de Pesquisas
```
📊 Pesquisas → Criar Pesquisa
📊 Pesquisas → Listar Pesquisas
📊 Pesquisas → Obter Estatísticas
📊 Pesquisas → Verificar WhatsApp
📊 Pesquisas → Verificar CPF
```

### 4. Teste de Filtros
```
📊 Pesquisas → Buscar Interessados
📊 Pesquisas → Buscar Satisfeitos
📊 Pesquisas → Buscar por Nome
📊 Pesquisas → Buscar por Provedor
```

## 📝 Exemplos de Dados para Teste

### Usuário de Teste
```json
{
  "username": "usuario_teste",
  "password": "senha123",
  "email": "usuario@teste.com"
}
```

### Pesquisa de Teste
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

## 🔧 Parâmetros de Query Disponíveis

### Paginação
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)

### Filtros de Pesquisa
- `search`: Busca por nome
- `bairro`: Filtrar por bairro
- `provedor_atual`: Filtrar por provedor
- `satisfacao`: Filtrar por satisfação
- `interesse`: Filtrar por interesse
- `filtro_satisfacao`: `satisfeitos` ou `insatisfeitos`
- `filtro_interesse`: `interessados` ou `nao-interessados`

## 🚨 Códigos de Status Esperados

### Sucesso
- `200`: OK - Requisição bem-sucedida
- `201`: Created - Recurso criado com sucesso

### Erro do Cliente
- `400`: Bad Request - Dados inválidos
- `401`: Unauthorized - Não autenticado
- `403`: Forbidden - Sem permissão
- `404`: Not Found - Recurso não encontrado
- `409`: Conflict - Conflito (ex: WhatsApp/CPF já existe)

### Erro do Servidor
- `500`: Internal Server Error - Erro interno

## 💡 Dicas de Uso

### 1. Ordem de Execução
- Sempre execute **Health Check** primeiro
- Faça **Login** antes de testar rotas protegidas
- Use **Verificar WhatsApp/CPF** antes de criar pesquisas

### 2. Dados de Teste
- Use dados únicos para cada teste
- Evite reutilizar WhatsApp/CPF já cadastrados
- Teste com diferentes cenários (satisfeito/insatisfeito, interessado/não interessado)

### 3. Debugging
- Verifique os logs do console do Postman
- Analise as respostas detalhadamente
- Use o **Tests** tab para validações automáticas

### 4. Performance
- Use paginação para listas grandes
- Combine filtros para buscas mais específicas
- Monitore o tempo de resposta

## 🔍 Troubleshooting

### Token Expirado
- Execute **Renovar Token** ou **Fazer Login** novamente

### Erro de Conexão
- Verifique se o servidor está rodando
- Confirme se a `base_url` está correta

### Erro de Validação
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme o formato dos dados (WhatsApp, CPF, etc.)

### Erro de Duplicação
- Use **Verificar WhatsApp/CPF** antes de criar
- Use dados únicos para cada teste

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o servidor está rodando
2. Confirme se o banco de dados está configurado
3. Analise os logs do servidor
4. Teste com dados diferentes
