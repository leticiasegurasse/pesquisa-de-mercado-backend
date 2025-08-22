import { Request, Response } from 'express';
import { Pesquisa, sequelize } from '../config/db';
import { Op } from 'sequelize';

// Interface para os dados da pesquisa
interface PesquisaData {
    nome: string;
    whatsapp: string;
    cpf?: string;
    provedor_atual: string;
    satisfacao: string;
    bairro: string;
    velocidade?: string;
    valor_mensal: string;
    uso_internet: string;
    interesse_proposta: string;
    responsavel: string;
}

// Interface para filtros de busca
interface PesquisaFilters {
    search?: string;
    nome?: string;
    bairro?: string;
    provedor_atual?: string;
    satisfacao?: string;
    interesse?: string;
    filtro_satisfacao?: 'satisfeitos' | 'insatisfeitos';
    filtro_interesse?: 'interessados' | 'nao_interessados';
}

// Interface para estatísticas
interface Estatisticas {
    total_pesquisas: number;
    por_satisfacao: Record<string, number>;
    por_interesse: Record<string, number>;
    provedores_mais_citados: Array<{ provedor: string; quantidade: number }>;
    bairros_mais_pesquisados: Array<{ bairro: string; quantidade: number }>;
    media_valor_mensal: string;
    interessados: number;
    nao_interessados: number;
    satisfeitos: number;
    insatisfeitos: number;
}

// Criar nova pesquisa
export const criarPesquisa = async (req: Request, res: Response) => {
    try {
        const pesquisaData: PesquisaData = req.body;

        // Verificar se WhatsApp já existe
        const whatsappExistente = await Pesquisa.findOne({
            where: { whatsapp: pesquisaData.whatsapp }
        });

        if (whatsappExistente) {
            return res.status(409).json({
                success: false,
                message: 'Este número de WhatsApp já foi cadastrado em uma pesquisa anterior.',
                error: 'WHATSAPP_DUPLICATE'
            });
        }

        // Verificar se CPF já existe (se fornecido)
        if (pesquisaData.cpf) {
            const cpfExistente = await Pesquisa.findOne({
                where: { cpf: pesquisaData.cpf }
            });

            if (cpfExistente) {
                return res.status(409).json({
                    success: false,
                    message: 'Este CPF já foi cadastrado em uma pesquisa anterior.',
                    error: 'CPF_DUPLICATE'
                });
            }
        }

        // Criar nova pesquisa
        const novaPesquisa = await Pesquisa.create(pesquisaData);

        res.status(201).json({
            success: true,
            message: 'Pesquisa criada com sucesso!',
            data: novaPesquisa
        });
    } catch (error: any) {
        console.error('Erro ao criar pesquisa:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
};

// Buscar todas as pesquisas com paginação e filtros
export const buscarPesquisas = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const filters: PesquisaFilters = req.query;
        const whereClause: any = {};

        // Aplicar filtros
        if (filters.search) {
            whereClause[Op.or] = [
                { nome: { [Op.iLike]: `%${filters.search}%` } },
                { whatsapp: { [Op.iLike]: `%${filters.search}%` } },
                { bairro: { [Op.iLike]: `%${filters.search}%` } }
            ];
        }

        if (filters.nome) {
            whereClause.nome = { [Op.iLike]: `%${filters.nome}%` };
        }

        if (filters.bairro) {
            whereClause.bairro = { [Op.iLike]: `%${filters.bairro}%` };
        }

        if (filters.provedor_atual) {
            whereClause.provedor_atual = filters.provedor_atual;
        }

        if (filters.satisfacao) {
            whereClause.satisfacao = filters.satisfacao;
        }

        if (filters.interesse) {
            whereClause.interesse_proposta = filters.interesse;
        }

        // Filtros específicos
        if (filters.filtro_satisfacao === 'satisfeitos') {
            whereClause.satisfacao = { [Op.in]: ['muito_satisfeito', 'satisfeito'] };
        } else if (filters.filtro_satisfacao === 'insatisfeitos') {
            whereClause.satisfacao = { [Op.in]: ['insatisfeito', 'muito_insatisfeito'] };
        }

        if (filters.filtro_interesse === 'interessados') {
            whereClause.interesse_proposta = 'sim';
        } else if (filters.filtro_interesse === 'nao_interessados') {
            whereClause.interesse_proposta = 'nao';
        }

        // Buscar pesquisas
        const { count, rows } = await Pesquisa.findAndCountAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            success: true,
            message: 'Pesquisas encontradas com sucesso',
            data: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages
            }
        });
    } catch (error: any) {
        console.error('Erro ao buscar pesquisas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
};

// Buscar apenas interessados
export const buscarInteressados = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Pesquisa.findAndCountAll({
            where: { interesse_proposta: 'sim' },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            success: true,
            message: 'Interessados encontrados com sucesso',
            data: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages
            }
        });
    } catch (error: any) {
        console.error('Erro ao buscar interessados:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
};

// Buscar apenas não interessados
export const buscarNaoInteressados = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Pesquisa.findAndCountAll({
            where: { interesse_proposta: 'nao' },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            success: true,
            message: 'Não interessados encontrados com sucesso',
            data: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages
            }
        });
    } catch (error: any) {
        console.error('Erro ao buscar não interessados:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
};

// Buscar satisfeitos
export const buscarSatisfeitos = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Pesquisa.findAndCountAll({
            where: {
                satisfacao: { [Op.in]: ['muito_satisfeito', 'satisfeito'] }
            },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            success: true,
            message: 'Satisfeitos encontrados com sucesso',
            data: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages
            }
        });
    } catch (error: any) {
        console.error('Erro ao buscar satisfeitos:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
};

// Buscar insatisfeitos
export const buscarInsatisfeitos = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Pesquisa.findAndCountAll({
            where: {
                satisfacao: { [Op.in]: ['insatisfeito', 'muito_insatisfeito'] }
            },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            success: true,
            message: 'Insatisfeitos encontrados com sucesso',
            data: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages
            }
        });
    } catch (error: any) {
        console.error('Erro ao buscar insatisfeitos:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
};

// Buscar por nome
export const buscarPorNome = async (req: Request, res: Response) => {
    try {
        const { nome } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Pesquisa.findAndCountAll({
            where: { nome: { [Op.iLike]: `%${nome}%` } },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            success: true,
            message: 'Pesquisas por nome encontradas com sucesso',
            data: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages
            }
        });
    } catch (error: any) {
        console.error('Erro ao buscar por nome:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
};

// Buscar por provedor
export const buscarPorProvedor = async (req: Request, res: Response) => {
    try {
        const { provedor } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Pesquisa.findAndCountAll({
            where: { provedor_atual: { [Op.iLike]: `%${provedor}%` } },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            success: true,
            message: 'Pesquisas por provedor encontradas com sucesso',
            data: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages
            }
        });
    } catch (error: any) {
        console.error('Erro ao buscar por provedor:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
};

// Buscar pesquisa por ID
export const buscarPesquisaPorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const pesquisa = await Pesquisa.findByPk(id);

        if (!pesquisa) {
            return res.status(404).json({
                success: false,
                message: 'Pesquisa não encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Pesquisa encontrada com sucesso',
            data: pesquisa
        });
    } catch (error: any) {
        console.error('Erro ao buscar pesquisa por ID:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
};

// Buscar pesquisas por bairro
export const buscarPesquisasPorBairro = async (req: Request, res: Response) => {
    try {
        const { bairro } = req.params;

        const pesquisas = await Pesquisa.findAll({
            where: { bairro: { [Op.iLike]: `%${bairro}%` } },
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            message: 'Pesquisas por bairro encontradas com sucesso',
            data: pesquisas
        });
    } catch (error: any) {
        console.error('Erro ao buscar pesquisas por bairro:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
};

// Buscar estatísticas
export const buscarEstatisticas = async (req: Request, res: Response) => {
    try {
        // Total de pesquisas
        const totalPesquisas = await Pesquisa.count();

        // Por satisfação
        const porSatisfacao = await Pesquisa.findAll({
            attributes: [
                'satisfacao',
                [sequelize.fn('COUNT', sequelize.col('satisfacao')), 'quantidade']
            ],
            group: ['satisfacao'],
            raw: true
        });

        // Por interesse
        const porInteresse = await Pesquisa.findAll({
            attributes: [
                'interesse_proposta',
                [sequelize.fn('COUNT', sequelize.col('interesse_proposta')), 'quantidade']
            ],
            group: ['interesse_proposta'],
            raw: true
        });

        // Provedores mais citados
        const provedoresMaisCitados = await Pesquisa.findAll({
            attributes: [
                'provedor_atual',
                [sequelize.fn('COUNT', sequelize.col('provedor_atual')), 'quantidade']
            ],
            group: ['provedor_atual'],
            order: [[sequelize.fn('COUNT', sequelize.col('provedor_atual')), 'DESC']],
            limit: 10,
            raw: true
        });

        // Bairros mais pesquisados
        const bairrosMaisPesquisados = await Pesquisa.findAll({
            attributes: [
                'bairro',
                [sequelize.fn('COUNT', sequelize.col('bairro')), 'quantidade']
            ],
            group: ['bairro'],
            order: [[sequelize.fn('COUNT', sequelize.col('bairro')), 'DESC']],
            limit: 10,
            raw: true
        });

        // Contadores específicos
        const interessados = await Pesquisa.count({ where: { interesse_proposta: 'sim' } });
        const naoInteressados = await Pesquisa.count({ where: { interesse_proposta: 'nao' } });
        const satisfeitos = await Pesquisa.count({
            where: { satisfacao: { [Op.in]: ['muito_satisfeito', 'satisfeito'] } }
        });
        const insatisfeitos = await Pesquisa.count({
            where: { satisfacao: { [Op.in]: ['insatisfeito', 'muito_insatisfeito'] } }
        });

        // Calcular valor médio mensal
        const pesquisasComValor = await Pesquisa.findAll({
            attributes: ['valor_mensal'],
            where: {
                valor_mensal: {
                    [Op.and]: [
                        { [Op.ne]: null },
                        { [Op.ne]: '' },
                        { [Op.ne]: 'R$ 0,00' },
                        { [Op.ne]: '0' },
                        { [Op.ne]: '0,00' }
                    ]
                }
            } as any,
            raw: true
        });

        // Função para converter valor string para número
        const converterValorParaNumero = (valorString: string): number => {
            // Remove R$, espaços e converte vírgula para ponto
            const valorLimpo = valorString
                .replace(/R\$\s*/g, '')
                .replace(/\s/g, '')
                .replace(',', '.');
            
            const valor = parseFloat(valorLimpo);
            return isNaN(valor) ? 0 : valor;
        };

        // Calcular média
        let mediaValorMensal = 'R$ 0,00';
        if (pesquisasComValor.length > 0) {
            const valores = pesquisasComValor
                .map(item => converterValorParaNumero(item.valor_mensal))
                .filter(valor => valor > 0);
            
            if (valores.length > 0) {
                const soma = valores.reduce((acc, valor) => acc + valor, 0);
                const media = soma / valores.length;
                mediaValorMensal = `R$ ${media.toFixed(2).replace('.', ',')}`;
            }
        }

        // Converter arrays para objetos
        const satisfacaoObj: Record<string, number> = {};
        porSatisfacao.forEach((item: any) => {
            satisfacaoObj[item.satisfacao] = parseInt(item.quantidade);
        });

        const interesseObj: Record<string, number> = {};
        porInteresse.forEach((item: any) => {
            interesseObj[item.interesse_proposta] = parseInt(item.quantidade);
        });

        const estatisticas: Estatisticas = {
            total_pesquisas: totalPesquisas,
            por_satisfacao: satisfacaoObj,
            por_interesse: interesseObj,
            provedores_mais_citados: provedoresMaisCitados.map((item: any) => ({
                provedor: item.provedor_atual,
                quantidade: parseInt(item.quantidade)
            })),
            bairros_mais_pesquisados: bairrosMaisPesquisados.map((item: any) => ({
                bairro: item.bairro,
                quantidade: parseInt(item.quantidade)
            })),
            media_valor_mensal: mediaValorMensal,
            interessados,
            nao_interessados: naoInteressados,
            satisfeitos,
            insatisfeitos
        };

        res.json({
            success: true,
            message: 'Estatísticas obtidas com sucesso',
            data: estatisticas
        });
    } catch (error: any) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
};

// Verificar se WhatsApp já existe
export const verificarWhatsApp = async (req: Request, res: Response) => {
    try {
        const { whatsapp } = req.params;

        const pesquisa = await Pesquisa.findOne({
            where: { whatsapp }
        });

        const jaExiste = !!pesquisa;

        res.json({
            success: true,
            message: jaExiste ? 'WhatsApp já cadastrado' : 'WhatsApp disponível',
            data: {
                whatsapp,
                jaExiste,
                message: jaExiste ? 'Este número já foi cadastrado' : 'Número disponível para cadastro'
            }
        });
    } catch (error: any) {
        console.error('Erro ao verificar WhatsApp:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
};

// Verificar se CPF já existe
export const verificarCPF = async (req: Request, res: Response) => {
    try {
        const { cpf } = req.params;

        const pesquisa = await Pesquisa.findOne({
            where: { cpf }
        });

        const jaExiste = !!pesquisa;

        res.json({
            success: true,
            message: jaExiste ? 'CPF já cadastrado' : 'CPF disponível',
            data: {
                cpf,
                jaExiste,
                message: jaExiste ? 'Este CPF já foi cadastrado' : 'CPF disponível para cadastro'
            }
        });
    } catch (error: any) {
        console.error('Erro ao verificar CPF:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
};
