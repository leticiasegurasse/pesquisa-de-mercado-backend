# Deploy no Easypanel

Este documento contém as instruções para fazer o deploy da API de Pesquisa de Mercado no Easypanel.

## 📋 Pré-requisitos

- Conta no Easypanel
- Repositório Git configurado
- Banco de dados PostgreSQL configurado

## 🚀 Passos para Deploy

### 1. Configuração no Easypanel

1. Acesse o painel do Easypanel
2. Crie um novo projeto
3. Conecte seu repositório Git
4. Selecione o repositório `pesquisa-de-mercado-backend`

### 2. Configuração do Serviço

#### Configurações Básicas:
- **Nome do Serviço**: `api`
- **Porta**: `3000`
- **Build Command**: (deixe vazio, o Dockerfile cuidará do build)
- **Start Command**: (deixe vazio, o Dockerfile cuidará do start)

#### Variáveis de Ambiente:
Configure as seguintes variáveis de ambiente no Easypanel:

```env
NODE_ENV=production
PORT=3000
DB_HOST=185.173.110.190
DB_PORT=5433
DB_NAME=pesquisa-mercado
DB_USER=postgres
DB_PASSWORD=adminpostgres
JWT_SECRET=sua_chave_secreta_jwt_muito_segura
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://seu-dominio-frontend.com
```

### 3. Configuração do Domínio

1. Configure um domínio personalizado (opcional)
2. Configure SSL/HTTPS
3. Configure proxy reverso se necessário

### 4. Health Check

O container inclui um health check que verifica o endpoint `/api/health`. Certifique-se de que este endpoint está funcionando corretamente.

## 🔧 Configurações Avançadas

### Recursos Recomendados:
- **CPU**: 0.5 - 1 vCPU
- **RAM**: 512MB - 1GB
- **Storage**: 1GB

### Configurações de Rede:
- **Porta Externa**: 3000
- **Protocolo**: HTTP/HTTPS

## 📊 Monitoramento

### Logs:
- Os logs da aplicação estarão disponíveis no painel do Easypanel
- Use o comando `docker logs` para debug se necessário

### Métricas:
- Monitoramento de CPU e RAM
- Status do health check
- Logs de erro

## 🔒 Segurança

### Recomendações:
1. **JWT_SECRET**: Use uma chave secreta forte e única
2. **CORS_ORIGIN**: Configure apenas os domínios necessários
3. **DB_PASSWORD**: Use senhas fortes para o banco de dados
4. **NODE_ENV**: Sempre use `production` em produção

### Variáveis Sensíveis:
- `JWT_SECRET`
- `DB_PASSWORD`
- `DB_USER`

## 🚨 Troubleshooting

### Problemas Comuns:

1. **Erro de conexão com banco de dados**:
   - Verifique se as credenciais do banco estão corretas
   - Verifique se o banco está acessível a partir do Easypanel

2. **Erro de build**:
   - Verifique se o Dockerfile está correto
   - Verifique se todas as dependências estão no package.json

3. **Erro de porta**:
   - Verifique se a porta 3000 está configurada corretamente
   - Verifique se não há conflitos de porta

### Comandos Úteis:

```bash
# Ver logs do container
docker logs <container_id>

# Entrar no container
docker exec -it <container_id> sh

# Verificar status do health check
curl http://localhost:3000/api/health
```

## 📞 Suporte

Para problemas específicos do Easypanel, consulte a documentação oficial ou entre em contato com o suporte.

## 🔄 Atualizações

Para atualizar a aplicação:
1. Faça push das alterações para o repositório
2. O Easypanel irá automaticamente fazer o rebuild
3. Monitore os logs para garantir que tudo está funcionando

## 📝 Notas Importantes

- O Dockerfile usa multi-stage build para otimizar o tamanho da imagem
- A aplicação roda como usuário não-root por segurança
- O health check verifica o endpoint `/api/health` a cada 30 segundos
- As variáveis de ambiente devem ser configuradas no painel do Easypanel
