import { PrismaClient, Satisfacao, InteresseProposta } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.pesquisaMercado.deleteMany();

  // Dados de exemplo
  const pesquisas = [
    {
      nome: 'João Silva',
      whatsapp: '(11) 99999-9999',
      provedor_atual: 'Vivo',
      satisfacao: Satisfacao.SATISFEITO,
      bairro: 'Centro',
      velocidade: '100 Mbps',
      valor_mensal: 'R$ 89,90',
      uso_internet: 'Trabalho, Netflix, jogos online',
      interesse_proposta: InteresseProposta.SIM_INTERESSE,
    },
    {
      nome: 'Maria Santos',
      whatsapp: '(11) 88888-8888',
      provedor_atual: 'Claro',
      satisfacao: Satisfacao.INSATISFEITO,
      bairro: 'Jardim América',
      velocidade: '50 Mbps',
      valor_mensal: 'R$ 120,00',
      uso_internet: 'Estudo, redes sociais, streaming',
      interesse_proposta: InteresseProposta.SIM_INTERESSE,
    },
    {
      nome: 'Pedro Costa',
      whatsapp: '(11) 77777-7777',
      provedor_atual: 'Oi',
      satisfacao: Satisfacao.MUITO_INSATISFEITO,
      bairro: 'Vila Nova',
      velocidade: '25 Mbps',
      valor_mensal: 'R$ 95,00',
      uso_internet: 'Trabalho remoto, videoconferências',
      interesse_proposta: InteresseProposta.SIM_INTERESSE,
    },
    {
      nome: 'Ana Oliveira',
      whatsapp: '(11) 66666-6666',
      provedor_atual: 'Tim',
      satisfacao: Satisfacao.MUITO_SATISFEITO,
      bairro: 'Boa Vista',
      velocidade: '200 Mbps',
      valor_mensal: 'R$ 150,00',
      uso_internet: 'Streaming 4K, jogos competitivos',
      interesse_proposta: InteresseProposta.NAO_INTERESSE,
    },
    {
      nome: 'Carlos Ferreira',
      whatsapp: '(11) 55555-5555',
      provedor_atual: 'Vivo',
      satisfacao: Satisfacao.SATISFEITO,
      bairro: 'Centro',
      velocidade: '80 Mbps',
      valor_mensal: 'R$ 75,00',
      uso_internet: 'Trabalho, estudo, redes sociais',
      interesse_proposta: InteresseProposta.SIM_INTERESSE,
    },
  ];

  // Inserir dados
  for (const pesquisa of pesquisas) {
    await prisma.pesquisaMercado.create({
      data: pesquisa,
    });
  }

  console.log(`✅ ${pesquisas.length} pesquisas criadas com sucesso!`);

  // Mostrar estatísticas
  const total = await prisma.pesquisaMercado.count();
  console.log(`📊 Total de pesquisas no banco: ${total}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
