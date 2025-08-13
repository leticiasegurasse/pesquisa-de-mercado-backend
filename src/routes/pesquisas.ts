import { Router } from 'express';
import {
  criarPesquisa,
  buscarPesquisas,
  buscarPesquisaPorId,
  buscarPesquisasPorBairro,
  buscarEstatisticas,
  atualizarPesquisa,
  deletarPesquisa
} from '../controllers/pesquisaController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rotas públicas
router.post('/', criarPesquisa); // Criar pesquisa (público)

// Rotas protegidas (requerem autenticação)
router.get('/', authenticateToken, buscarPesquisas); // Listar pesquisas
router.get('/estatisticas', authenticateToken, buscarEstatisticas); // Estatísticas
router.get('/bairro/:bairro', authenticateToken, buscarPesquisasPorBairro); // Por bairro
router.get('/:id', authenticateToken, buscarPesquisaPorId); // Por ID
router.put('/:id', authenticateToken, atualizarPesquisa); // Atualizar
router.delete('/:id', authenticateToken, deletarPesquisa); // Deletar

export default router;
