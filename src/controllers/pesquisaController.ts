import { Request, Response } from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/database';
import Pesquisa from '../models/Pesquisa';
import whatsappService from '../services/whatsappService';

// Função auxiliar para verificar se WhatsApp já existe
const verificarWhatsAppExistente = async (whatsapp: string): Promise<boolean> => {
  const whatsappNormalizado = whatsapp.replace(/\D/g, '');
  
  const pesquisaExistente = await Pesquisa.findOne({
    where: {
      whatsapp: {
        [Op.or]: [
          whatsapp,
          { [Op.iLike]: `%${whatsappNormalizado}%` }
        ]
      }
    }
  });
  
  return !!pesquisaExistente;
};

// Criar nova pesquisa
export const criarPesquisa = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      nome,
      whatsapp,
      provedor_atual,
      satisfacao,
      bairro,
      velocidade,
      valor_mensal,
      uso_internet,
      interesse_proposta
    } = req.body;

    // Validações básicas
    if (!nome || !whatsapp || !provedor_atual || !satisfacao || !bairro || !valor_mensal || !uso_internet || !interesse_proposta) {
      res.status(400).json({
        success: false,
        message: 'Todos os campos obrigatórios devem ser preenchidos'
      });
      return;
    }

    // Verificar se o WhatsApp já foi cadastrado
    const whatsappJaExiste = await verificarWhatsAppExistente(whatsapp);
    
    if (whatsappJaExiste) {
      res.status(409).json({
        success: false,
        message: 'Este número de WhatsApp já foi cadastrado em uma pesquisa anterior. Cada número pode participar apenas uma vez.',
        error: 'WHATSAPP_DUPLICATE'
      });
      return;
    }

    // Criar pesquisa
    const pesquisa = await Pesquisa.create({
      nome,
      whatsapp,
      provedor_atual,
      satisfacao,
      bairro,
      velocidade: velocidade || '',
      valor_mensal,
      uso_internet,
      interesse_proposta
    });

    // Enviar notificação WhatsApp (em background, não bloqueia a resposta)
    try {
      await whatsappService.sendPesquisaNotification({
        nome,
        whatsapp,
        provedor_atual,
        satisfacao,
        bairro,
        velocidade,
        valor_mensal,
        uso_internet,
        interesse_proposta
      });
    } catch (whatsappError) {
      console.error('❌ Erro ao enviar notificação WhatsApp:', whatsappError);
      // Não falha a criação da pesquisa se o WhatsApp falhar
    }

    res.status(201).json({
      success: true,
      message: 'Pesquisa criada com sucesso!',
      data: pesquisa
    });
  } catch (error: any) {
    console.error('Erro ao criar pesquisa:', error);
    
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors.map((err: any) => err.message)
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar todas as pesquisas com filtros avançados
export const buscarPesquisas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      bairro, 
      satisfacao, 
      interesse,
      nome,
      provedor_atual,
      filtro_satisfacao,
      filtro_interesse
    } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);
    
    // Construir filtros
    const where: any = {};
    
    // Busca geral por texto (nome, bairro, provedor)
    if (search) {
      where[Op.or] = [
        { nome: { [Op.iLike]: `%${search}%` } },
        { bairro: { [Op.iLike]: `%${search}%` } },
        { provedor_atual: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Filtros específicos
    if (nome) {
      where.nome = { [Op.iLike]: `%${nome}%` };
    }
    
    if (bairro) {
      where.bairro = { [Op.iLike]: `%${bairro}%` };
    }
    
    if (provedor_atual) {
      where.provedor_atual = { [Op.iLike]: `%${provedor_atual}%` };
    }
    
    // Filtro por satisfação específica
    if (satisfacao) {
      where.satisfacao = satisfacao;
    }
    
    // Filtro por satisfação agrupada (satisfeitos/insatisfeitos)
    if (filtro_satisfacao) {
      if (filtro_satisfacao === 'satisfeitos') {
        where.satisfacao = { [Op.in]: ['Muito satisfeito', 'Satisfeito'] };
      } else if (filtro_satisfacao === 'insatisfeitos') {
        where.satisfacao = { [Op.in]: ['Insatisfeito', 'Muito insatisfeito'] };
      }
    }
    
    // Filtro por interesse específico
    if (interesse) {
      where.interesse_proposta = interesse;
    }
    
    // Filtro por interesse agrupado (interessados/não interessados)
    if (filtro_interesse) {
      if (filtro_interesse === 'interessados') {
        where.interesse_proposta = 'Sim, tenho interesse';
      } else if (filtro_interesse === 'nao_interessados') {
        where.interesse_proposta = 'Não tenho interesse';
      }
    }

    const { count, rows: pesquisas } = await Pesquisa.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.status(200).json({
      success: true,
      data: pesquisas,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar pesquisas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar pesquisas por interessados
export const buscarInteressados = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows: pesquisas } = await Pesquisa.findAndCountAll({
      where: {
        interesse_proposta: 'Sim, tenho interesse'
      },
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.status(200).json({
      success: true,
      data: pesquisas,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar interessados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar pesquisas por não interessados
export const buscarNaoInteressados = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows: pesquisas } = await Pesquisa.findAndCountAll({
      where: {
        interesse_proposta: 'Não tenho interesse'
      },
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.status(200).json({
      success: true,
      data: pesquisas,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar não interessados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar pesquisas por satisfeitos
export const buscarSatisfeitos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows: pesquisas } = await Pesquisa.findAndCountAll({
      where: {
        satisfacao: { [Op.in]: ['Muito satisfeito', 'Satisfeito'] }
      },
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.status(200).json({
      success: true,
      data: pesquisas,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar satisfeitos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar pesquisas por insatisfeitos
export const buscarInsatisfeitos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows: pesquisas } = await Pesquisa.findAndCountAll({
      where: {
        satisfacao: { [Op.in]: ['Insatisfeito', 'Muito insatisfeito'] }
      },
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.status(200).json({
      success: true,
      data: pesquisas,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar insatisfeitos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar pesquisas por nome
export const buscarPorNome = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows: pesquisas } = await Pesquisa.findAndCountAll({
      where: {
        nome: { [Op.iLike]: `%${nome}%` }
      },
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.status(200).json({
      success: true,
      data: pesquisas,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar por nome:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar pesquisas por provedor
export const buscarPorProvedor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { provedor } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows: pesquisas } = await Pesquisa.findAndCountAll({
      where: {
        provedor_atual: { [Op.iLike]: `%${provedor}%` }
      },
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.status(200).json({
      success: true,
      data: pesquisas,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar por provedor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar pesquisa por ID
export const buscarPesquisaPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const pesquisa = await Pesquisa.findByPk(id);
    
    if (!pesquisa) {
      res.status(404).json({
        success: false,
        message: 'Pesquisa não encontrada'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: pesquisa
    });
  } catch (error) {
    console.error('Erro ao buscar pesquisa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar pesquisas por bairro
export const buscarPesquisasPorBairro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bairro } = req.params;
    
    const pesquisas = await Pesquisa.findAll({
      where: {
        bairro: { [Op.iLike]: `%${bairro}%` }
      },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: pesquisas
    });
  } catch (error) {
    console.error('Erro ao buscar pesquisas por bairro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Verificar se WhatsApp já existe
export const verificarWhatsApp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { whatsapp } = req.params;
    
    if (!whatsapp) {
      res.status(400).json({
        success: false,
        message: 'Número de WhatsApp é obrigatório'
      });
      return;
    }
    
    const jaExiste = await verificarWhatsAppExistente(whatsapp);
    
    res.status(200).json({
      success: true,
      data: {
        whatsapp,
        jaExiste,
        message: jaExiste 
          ? 'Este número já foi cadastrado em uma pesquisa anterior'
          : 'Número disponível para cadastro'
      }
    });
  } catch (error: any) {
    console.error('Erro ao verificar WhatsApp:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar estatísticas
export const buscarEstatisticas = async (req: Request, res: Response): Promise<void> => {
  try {
    // Total de pesquisas
    const totalPesquisas = await Pesquisa.count();

    // Pesquisas por satisfação
    const porSatisfacao = await Pesquisa.findAll({
      attributes: [
        'satisfacao',
        [sequelize.fn('COUNT', sequelize.col('id')), 'quantidade']
      ],
      group: ['satisfacao'],
      raw: true
    });

    // Pesquisas por interesse
    const porInteresse = await Pesquisa.findAll({
      attributes: [
        'interesse_proposta',
        [sequelize.fn('COUNT', sequelize.col('id')), 'quantidade']
      ],
      group: ['interesse_proposta'],
      raw: true
    });

    // Provedores mais citados
    const provedoresMaisCitados = await Pesquisa.findAll({
      attributes: [
        'provedor_atual',
        [sequelize.fn('COUNT', sequelize.col('id')), 'quantidade']
      ],
      group: ['provedor_atual'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10,
      raw: true
    });

    // Bairros mais pesquisados
    const bairrosMaisPesquisados = await Pesquisa.findAll({
      attributes: [
        'bairro',
        [sequelize.fn('COUNT', sequelize.col('id')), 'quantidade']
      ],
      group: ['bairro'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10,
      raw: true
    });

    // Média de valor mensal (extrair números dos valores)
    const todasPesquisas = await Pesquisa.findAll({
      attributes: ['valor_mensal'],
      raw: true
    });

    const valoresNumericos = todasPesquisas
      .map(p => p.valor_mensal)
      .filter(valor => valor)
      .map(valor => {
        const numero = valor.replace(/[^\d,]/g, '').replace(',', '.');
        return parseFloat(numero) || 0;
      })
      .filter(valor => valor > 0);

    const mediaValorMensal = valoresNumericos.length > 0 
      ? (valoresNumericos.reduce((a, b) => a + b, 0) / valoresNumericos.length).toFixed(2)
      : '0.00';

    const estatisticas = {
      total_pesquisas: totalPesquisas,
      por_satisfacao: porSatisfacao.reduce((acc, item: any) => {
        acc[item.satisfacao] = parseInt(item.quantidade);
        return acc;
      }, {} as Record<string, number>),
      por_interesse: porInteresse.reduce((acc, item: any) => {
        acc[item.interesse_proposta] = parseInt(item.quantidade);
        return acc;
      }, {} as Record<string, number>),
      provedores_mais_citados: provedoresMaisCitados.map((item: any) => ({
        provedor: item.provedor_atual,
        quantidade: parseInt(item.quantidade)
      })),
      bairros_mais_pesquisados: bairrosMaisPesquisados.map((item: any) => ({
        bairro: item.bairro,
        quantidade: parseInt(item.quantidade)
      })),
      media_valor_mensal: `R$ ${mediaValorMensal}`
    };

    res.status(200).json({
      success: true,
      data: estatisticas
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Atualizar pesquisa
export const atualizarPesquisa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const pesquisa = await Pesquisa.findByPk(id);
    
    if (!pesquisa) {
      res.status(404).json({
        success: false,
        message: 'Pesquisa não encontrada'
      });
      return;
    }

    await pesquisa.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Pesquisa atualizada com sucesso',
      data: pesquisa
    });
  } catch (error: any) {
    console.error('Erro ao atualizar pesquisa:', error);
    
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors.map((err: any) => err.message)
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Deletar pesquisa
export const deletarPesquisa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const pesquisa = await Pesquisa.findByPk(id);
    
    if (!pesquisa) {
      res.status(404).json({
        success: false,
        message: 'Pesquisa não encontrada'
      });
      return;
    }

    await pesquisa.destroy();

    res.status(200).json({
      success: true,
      message: 'Pesquisa deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar pesquisa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};
