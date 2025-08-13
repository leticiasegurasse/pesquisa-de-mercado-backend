// Script para testar verificação de WhatsApp duplicado
const API_URL = 'http://localhost:3000';

async function testWhatsAppDuplicate() {
  console.log('🧪 Testando verificação de WhatsApp duplicado...\n');

  const testWhatsApp = '(11) 99999-9999';

  // Teste 1: Verificar WhatsApp que não existe
  console.log('1️⃣ Verificando WhatsApp que não existe...');
  try {
    const checkResponse = await fetch(`${API_URL}/api/pesquisas/verificar-whatsapp/${testWhatsApp}`);
    const checkData = await checkResponse.json();
    console.log('✅ Verificação:', checkData);
  } catch (error) {
    console.error('❌ Erro na verificação:', error.message);
  }

  // Teste 2: Criar primeira pesquisa
  console.log('\n2️⃣ Criando primeira pesquisa...');
  try {
    const createResponse = await fetch(`${API_URL}/api/pesquisas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: 'João Silva Teste',
        whatsapp: testWhatsApp,
        provedor_atual: 'Vivo',
        satisfacao: 'Satisfeito',
        bairro: 'Centro',
        velocidade: '100 Mbps',
        valor_mensal: 'R$ 89,90',
        uso_internet: 'Trabalho, Netflix, jogos online',
        interesse_proposta: 'Sim, tenho interesse'
      })
    });
    const createData = await createResponse.json();
    console.log('✅ Primeira pesquisa:', createData.success ? 'Criada' : 'Falha');
  } catch (error) {
    console.error('❌ Erro na criação:', error.message);
  }

  // Teste 3: Verificar WhatsApp que agora existe
  console.log('\n3️⃣ Verificando WhatsApp que agora existe...');
  try {
    const checkResponse2 = await fetch(`${API_URL}/api/pesquisas/verificar-whatsapp/${testWhatsApp}`);
    const checkData2 = await checkResponse2.json();
    console.log('✅ Verificação após criação:', checkData2);
  } catch (error) {
    console.error('❌ Erro na verificação:', error.message);
  }

  // Teste 4: Tentar criar pesquisa duplicada
  console.log('\n4️⃣ Tentando criar pesquisa duplicada...');
  try {
    const duplicateResponse = await fetch(`${API_URL}/api/pesquisas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: 'Maria Silva Teste',
        whatsapp: testWhatsApp, // Mesmo número
        provedor_atual: 'Claro',
        satisfacao: 'Insatisfeito',
        bairro: 'Centro',
        velocidade: '50 Mbps',
        valor_mensal: 'R$ 120,00',
        uso_internet: 'Trabalho',
        interesse_proposta: 'Não tenho interesse'
      })
    });
    const duplicateData = await duplicateResponse.json();
    console.log('✅ Tentativa de duplicata:', duplicateData.success ? '❌ Deveria ter falhado' : '✅ Bloqueada corretamente');
    console.log('💬 Mensagem:', duplicateData.message);
  } catch (error) {
    console.error('❌ Erro na tentativa de duplicata:', error.message);
  }

  // Teste 5: Testar com formato diferente do mesmo número
  console.log('\n5️⃣ Testando com formato diferente do mesmo número...');
  try {
    const differentFormatResponse = await fetch(`${API_URL}/api/pesquisas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: 'Pedro Silva Teste',
        whatsapp: '11999999999', // Formato diferente do mesmo número
        provedor_atual: 'Oi',
        satisfacao: 'Muito satisfeito',
        bairro: 'Centro',
        velocidade: '200 Mbps',
        valor_mensal: 'R$ 150,00',
        uso_internet: 'Jogos online',
        interesse_proposta: 'Sim, tenho interesse'
      })
    });
    const differentFormatData = await differentFormatResponse.json();
    console.log('✅ Formato diferente:', differentFormatData.success ? '❌ Deveria ter falhado' : '✅ Bloqueada corretamente');
    console.log('💬 Mensagem:', differentFormatData.message);
  } catch (error) {
    console.error('❌ Erro no teste de formato diferente:', error.message);
  }

  console.log('\n🎉 Teste de WhatsApp duplicado concluído!');
}

// Executar teste
testWhatsAppDuplicate().catch(console.error);
