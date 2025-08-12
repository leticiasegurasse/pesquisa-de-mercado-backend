import prisma from '../lib/prisma';
import evolutionService from './evolutionService';
import { CreatePesquisaInput, ApiResponse, SATISFACAO_MAP, INTERESSE_MAP } from '../types';

class PesquisaService {
  // Criar nova pesquisa
  async createPesquisa(pesquisa: CreatePesquisaInput): Promise<ApiResponse> {
    try {
      // Converter strings para enums do Prisma
      const pesquisaData = {
        nome: pesquisa.nome,
        whatsapp: pesquisa.whatsapp,
        provedor_atual: pesquisa.provedor_atual,
        satisfacao: SATISFACAO_MAP[pesquisa.satisfacao as keyof typeof SATISFACAO_MAP],
        bairro: pesquisa.bairro,
        velocidade: pesquisa.velocidade,
        valor_mensal: pesquisa.valor_mensal,
        uso_internet: pesquisa.uso_internet,
        interesse_proposta: INTERESSE_MAP[pesquisa.interesse_proposta as keyof typeof INTERESSE_MAP],
      };

      const novaPesquisa = await prisma.pesquisaMercado.create({
        data: pesquisaData
      });

      // Enviar notificação via WhatsApp
      try {
        await evolutionService.sendPesquisaNotification(novaPesquisa);
        console.log('✅ Notificação enviada via WhatsApp');
      } catch (whatsappError) {
        console.error('⚠️ Erro ao enviar notificação WhatsApp:', whatsappError);
        // Não falha a operação se o WhatsApp der erro
      }

      return {
        success: true,
        message: 'Pesquisa criada com sucesso',
        data: novaPesquisa
      };

    } catch (error: any) {
      console.error('❌ Erro ao criar pesquisa:', error);
      
      return {
        success: false,
        message: 'Erro ao criar pesquisa',
        error: error.message
      };
    }
  }

  // Buscar todas as pesquisas
  async getAllPesquisas(): Promise<ApiResponse> {
    try {
      const pesquisas = await prisma.pesquisaMercado.findMany({
        orderBy: {
          created_at: 'desc'
        }
      });
      
      return {
        success: true,
        message: 'Pesquisas encontradas',
        data: pesquisas
      };
    } catch (error: any) {
      console.error('❌ Erro ao buscar pesquisas:', error);
      
      return {
        success: false,
        message: 'Erro ao buscar pesquisas',
        error: error.message
      };
    }
  }

  // Buscar pesquisa por ID
  async getPesquisaById(id: number): Promise<ApiResponse> {
    try {
      const pesquisa = await prisma.pesquisaMercado.findUnique({
        where: { id }
      });
      
      if (!pesquisa) {
        return {
          success: false,
          message: 'Pesquisa não encontrada'
        };
      }
      
      return {
        success: true,
        message: 'Pesquisa encontrada',
        data: pesquisa
      };
    } catch (error: any) {
      console.error('❌ Erro ao buscar pesquisa:', error);
      
      return {
        success: false,
        message: 'Erro ao buscar pesquisa',
        error: error.message
      };
    }
  }

  // Buscar pesquisas por bairro
  async getPesquisasByBairro(bairro: string): Promise<ApiResponse> {
    try {
      const pesquisas = await prisma.pesquisaMercado.findMany({
        where: {
          bairro: {
            contains: bairro,
            mode: 'insensitive'
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });
      
      return {
        success: true,
        message: 'Pesquisas encontradas',
        data: pesquisas
      };
    } catch (error: any) {
      console.error('❌ Erro ao buscar pesquisas por bairro:', error);
      
      return {
        success: false,
        message: 'Erro ao buscar pesquisas',
        error: error.message
      };
    }
  }

  // Obter estatísticas
  async getEstatisticas(): Promise<ApiResponse> {
    try {
      const [total, hoje, satisfacao, bairros, interesse] = await Promise.all([
        prisma.pesquisaMercado.count(),
        prisma.pesquisaMercado.count({
          where: {
            created_at: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }),
        prisma.pesquisaMercado.groupBy({
          by: ['satisfacao'],
          _count: {
            satisfacao: true
          }
        }),
        prisma.pesquisaMercado.groupBy({
          by: ['bairro'],
          _count: {
            bairro: true
          },
          orderBy: {
            _count: {
              bairro: 'desc'
            }
          },
          take: 10
        }),
        prisma.pesquisaMercado.groupBy({
          by: ['interesse_proposta'],
          _count: {
            interesse_proposta: true
          }
        })
      ]);

      return {
        success: true,
        message: 'Estatísticas obtidas com sucesso',
        data: {
          total,
          hoje,
          satisfacao: satisfacao.map(s => ({
            satisfacao: s.satisfacao,
            quantidade: s._count.satisfacao
          })),
          bairros: bairros.map(b => ({
            bairro: b.bairro,
            quantidade: b._count.bairro
          })),
          interesse: interesse.map(i => ({
            interesse_proposta: i.interesse_proposta,
            quantidade: i._count.interesse_proposta
          }))
        }
      };
    } catch (error: any) {
      console.error('❌ Erro ao obter estatísticas:', error);
      
      return {
        success: false,
        message: 'Erro ao obter estatísticas',
        error: error.message
      };
    }
  }

  // Verificar se WhatsApp já foi usado
  async checkWhatsAppExists(whatsapp: string): Promise<boolean> {
    try {
      const count = await prisma.pesquisaMercado.count({
        where: { whatsapp }
      });
      return count > 0;
    } catch (error) {
      console.error('❌ Erro ao verificar WhatsApp:', error);
      return false;
    }
  }
}

export default new PesquisaService();
