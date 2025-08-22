# 🔧 Scripts Úteis para Postman

## 📝 Scripts de Teste Automatizados

### 1. Script para Capturar Token (Login)

**Localização:** Tests da requisição "Fazer Login"

```javascript
// Capturar token automaticamente após login
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.data && response.data.token) {
        pm.environment.set("auth_token", response.data.token);
        pm.environment.set("refresh_token", response.data.refreshToken);
        pm.environment.set("user_id", response.data.user.id);
        console.log("✅ Token capturado automaticamente!");
        console.log("User ID:", response.data.user.id);
    }
}

// Validar resposta
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has token", function () {
    const response = pm.response.json();
    pm.expect(response.data).to.have.property('token');
    pm.expect(response.data.token).to.not.be.empty;
});
```

### 2. Script para Capturar ID da Pesquisa

**Localização:** Tests da requisição "Criar Pesquisa"

```javascript
// Capturar ID da pesquisa criada
if (pm.response.code === 201) {
    const response = pm.response.json();
    if (response.data && response.data.id) {
        pm.environment.set("pesquisa_id", response.data.id);
        console.log("✅ Pesquisa criada com ID:", response.data.id);
    }
}

// Validar resposta
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Pesquisa created successfully", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data).to.have.property('id');
});
```

### 3. Script para Validar Health Check

**Localização:** Tests da requisição "Health Check"

```javascript
// Validar health check
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("API is healthy", function () {
    const response = pm.response.json();
    pm.expect(response.status).to.eql("OK");
    pm.expect(response.message).to.include("funcionando");
    pm.expect(response).to.have.property('timestamp');
});

pm.test("Response time is less than 1000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});
```

### 4. Script para Validar Listagem de Pesquisas

**Localização:** Tests da requisição "Listar Pesquisas"

```javascript
// Validar listagem de pesquisas
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has correct structure", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data).to.have.property('pesquisas');
    pm.expect(response.data).to.have.property('pagination');
    pm.expect(response.data.pesquisas).to.be.an('array');
});

pm.test("Pagination info is present", function () {
    const response = pm.response.json();
    const pagination = response.data.pagination;
    pm.expect(pagination).to.have.property('current_page');
    pm.expect(pagination).to.have.property('total_pages');
    pm.expect(pagination).to.have.property('total_items');
    pm.expect(pagination).to.have.property('items_per_page');
});
```

### 5. Script para Validar Estatísticas

**Localização:** Tests da requisição "Obter Estatísticas"

```javascript
// Validar estatísticas
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Statistics structure is correct", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data).to.have.property('total_pesquisas');
    pm.expect(response.data).to.have.property('por_satisfacao');
    pm.expect(response.data).to.have.property('por_interesse');
    pm.expect(response.data).to.have.property('provedores_mais_citados');
    pm.expect(response.data).to.have.property('bairros_mais_pesquisados');
});

pm.test("Total pesquisas is a number", function () {
    const response = pm.response.json();
    pm.expect(response.data.total_pesquisas).to.be.a('number');
    pm.expect(response.data.total_pesquisas).to.be.at.least(0);
});
```

### 6. Script para Validar Verificação de WhatsApp

**Localização:** Tests da requisição "Verificar WhatsApp"

```javascript
// Validar verificação de WhatsApp
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("WhatsApp check response is valid", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data).to.have.property('disponivel');
    pm.expect(response.data.disponivel).to.be.a('boolean');
});

// Log do resultado
const response = pm.response.json();
if (response.data.disponivel) {
    console.log("✅ WhatsApp disponível para uso");
} else {
    console.log("⚠️ WhatsApp já está em uso");
}
```

### 7. Script para Validar Verificação de CPF

**Localização:** Tests da requisição "Verificar CPF"

```javascript
// Validar verificação de CPF
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("CPF check response is valid", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data).to.have.property('disponivel');
    pm.expect(response.data.disponivel).to.be.a('boolean');
});

// Log do resultado
const response = pm.response.json();
if (response.data.disponivel) {
    console.log("✅ CPF disponível para uso");
} else {
    console.log("⚠️ CPF já está em uso");
}
```

### 8. Script para Validar Token (Rotas Protegidas)

**Localização:** Tests de qualquer rota protegida

```javascript
// Validar token em rotas protegidas
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Token is valid", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.message).to.not.include("não autorizado");
    pm.expect(response.message).to.not.include("token inválido");
});

// Verificar se token ainda é válido
const authToken = pm.environment.get("auth_token");
if (!authToken) {
    console.log("⚠️ Token não encontrado. Execute o login primeiro.");
}
```

## 🔄 Scripts de Pré-requisição

### 1. Script para Definir Headers Automaticamente

**Localização:** Pre-request Script da coleção

```javascript
// Definir headers automaticamente para rotas protegidas
const authToken = pm.environment.get("auth_token");
if (authToken && pm.request.url.path.includes("/auth/")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + authToken
    });
}
```

### 2. Script para Validar Ambiente

**Localização:** Pre-request Script da coleção

```javascript
// Validar se as variáveis de ambiente estão configuradas
const baseUrl = pm.environment.get("base_url");
if (!baseUrl) {
    console.error("❌ base_url não configurada!");
    throw new Error("Configure a variável base_url no ambiente");
}

console.log("🌐 Usando URL:", baseUrl);
```

## 📊 Scripts de Monitoramento

### 1. Script para Monitorar Performance

```javascript
// Monitorar tempo de resposta
const responseTime = pm.response.responseTime;
console.log("⏱️ Tempo de resposta:", responseTime + "ms");

if (responseTime > 2000) {
    console.warn("⚠️ Resposta lenta detectada!");
}

pm.test("Response time is acceptable", function () {
    pm.expect(responseTime).to.be.below(5000);
});
```

### 2. Script para Log de Requisições

```javascript
// Log detalhado da requisição
console.log("📤 Método:", pm.request.method);
console.log("🔗 URL:", pm.request.url.toString());
console.log("📊 Status:", pm.response.status);
console.log("📏 Tamanho:", pm.response.size().body + " bytes");
```

## 🎯 Scripts de Validação de Dados

### 1. Validar Formato de WhatsApp

```javascript
// Validar formato de WhatsApp
pm.test("WhatsApp format is valid", function () {
    const response = pm.response.json();
    if (response.data && response.data.whatsapp) {
        const whatsapp = response.data.whatsapp;
        const whatsappRegex = /^\d{10,11}$/;
        pm.expect(whatsappRegex.test(whatsapp)).to.be.true;
    }
});
```

### 2. Validar Formato de CPF

```javascript
// Validar formato de CPF
pm.test("CPF format is valid", function () {
    const response = pm.response.json();
    if (response.data && response.data.cpf) {
        const cpf = response.data.cpf.replace(/\D/g, '');
        pm.expect(cpf.length).to.eql(11);
    }
});
```

### 3. Validar Campos Obrigatórios

```javascript
// Validar campos obrigatórios da pesquisa
pm.test("Required fields are present", function () {
    const response = pm.response.json();
    if (response.data) {
        const requiredFields = ['nome', 'whatsapp', 'provedor_atual', 'satisfacao', 'bairro', 'valor_mensal', 'uso_internet', 'interesse_proposta', 'responsavel'];
        requiredFields.forEach(field => {
            pm.expect(response.data).to.have.property(field);
            pm.expect(response.data[field]).to.not.be.empty;
        });
    }
});
```

## 🚀 Como Usar os Scripts

1. **Abra a requisição no Postman**
2. **Vá para a aba "Tests"**
3. **Cole o script desejado**
4. **Salve a requisição**
5. **Execute e veja os resultados no console**

## 📝 Dicas Importantes

- **Console**: Use `console.log()` para debug
- **Variáveis**: Use `pm.environment.set()` e `pm.environment.get()`
- **Testes**: Use `pm.test()` para validações automáticas
- **Performance**: Monitore `pm.response.responseTime`
- **Headers**: Use `pm.request.headers.add()` para headers dinâmicos

Esses scripts tornarão seus testes muito mais eficientes e automatizados! 🎉
