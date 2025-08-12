// src/routes/pesquisaRoutes.ts
import { Router } from 'express';
import pesquisaController from '../controllers/pesquisaController';
import { validate, validateParams, schemas } from '../middleware/validation';

const router = Router();

// Health check
router.get('/health', pesquisaController.healthCheck);

// Rotas de pesquisa
router.post('/pesquisas', validate(schemas.pesquisa), pesquisaController.createPesquisa);
router.get('/pesquisas', pesquisaController.getAllPesquisas);

// Coloque a rota específica ANTES da rota com :id
router.get('/pesquisas/bairro/:bairro', validateParams(schemas.bairro), pesquisaController.getPesquisasByBairro);

// Restringe :id para apenas números para evitar conflitos com "/bairro/..."
router.get('/pesquisas/:id(\\d+)', validateParams(schemas.id), pesquisaController.getPesquisaById);

// Estatísticas
router.get('/estatisticas', pesquisaController.getEstatisticas);

export default router;
