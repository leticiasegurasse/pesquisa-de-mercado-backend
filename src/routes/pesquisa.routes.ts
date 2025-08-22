import { Router } from 'express';
import {
    criarPesquisa,
    buscarPesquisas,
    buscarInteressados,
    buscarNaoInteressados,
    buscarSatisfeitos,
    buscarInsatisfeitos,
    buscarPorNome,
    buscarPorProvedor,
    buscarPesquisaPorId,
    buscarPesquisasPorBairro,
    buscarEstatisticas,
    verificarWhatsApp,
    verificarCPF
} from '../controllers/pesquisa.controller';
import { validatePesquisa } from '../middlewares/validationMiddleware';
import asyncMiddleware from '../middlewares/asyncMiddleware';

const pesquisaRoutes = Router();

// Rotas públicas (não precisam de autenticação)
pesquisaRoutes.post('/', validatePesquisa, asyncMiddleware(criarPesquisa));
pesquisaRoutes.get('/estatisticas', asyncMiddleware(buscarEstatisticas));
pesquisaRoutes.get('/verificar-whatsapp/:whatsapp', asyncMiddleware(verificarWhatsApp));
pesquisaRoutes.get('/verificar-cpf/:cpf', asyncMiddleware(verificarCPF));

// Rotas de busca com filtros
pesquisaRoutes.get('/', asyncMiddleware(buscarPesquisas));
pesquisaRoutes.get('/interessados', asyncMiddleware(buscarInteressados));
pesquisaRoutes.get('/nao-interessados', asyncMiddleware(buscarNaoInteressados));
pesquisaRoutes.get('/satisfeitos', asyncMiddleware(buscarSatisfeitos));
pesquisaRoutes.get('/insatisfeitos', asyncMiddleware(buscarInsatisfeitos));

// Rotas de busca específicas
pesquisaRoutes.get('/nome/:nome', asyncMiddleware(buscarPorNome));
pesquisaRoutes.get('/provedor/:provedor', asyncMiddleware(buscarPorProvedor));
pesquisaRoutes.get('/bairro/:bairro', asyncMiddleware(buscarPesquisasPorBairro));
pesquisaRoutes.get('/:id', asyncMiddleware(buscarPesquisaPorId));

export default pesquisaRoutes;
