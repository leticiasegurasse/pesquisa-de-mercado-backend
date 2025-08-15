import { Router } from 'express';
import {
  criarPesquisa,
  buscarPesquisas,
  buscarPesquisaPorId,
  buscarPesquisasPorBairro,
  buscarEstatisticas,
  atualizarPesquisa,
  deletarPesquisa,
  verificarWhatsApp,
  verificarCPF,
  buscarInteressados,
  buscarNaoInteressados,
  buscarSatisfeitos,
  buscarInsatisfeitos,
  buscarPorNome,
  buscarPorProvedor
} from '../controllers/pesquisaController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rotas públicas
router.post('/', criarPesquisa); // Criar pesquisa (público)
router.get('/verificar-whatsapp/:whatsapp', verificarWhatsApp); // Verificar WhatsApp (público)
router.get('/verificar-cpf/:cpf', verificarCPF); // Verificar CPF (público)

// Rotas protegidas (requerem autenticação)
router.get('/', authenticateToken, buscarPesquisas); // Listar pesquisas com filtros
router.get('/estatisticas', authenticateToken, buscarEstatisticas); // Estatísticas

// Filtros específicos
router.get('/interessados', authenticateToken, buscarInteressados); // Apenas interessados
router.get('/nao-interessados', authenticateToken, buscarNaoInteressados); // Apenas não interessados
router.get('/satisfeitos', authenticateToken, buscarSatisfeitos); // Satisfeitos e muito satisfeitos
router.get('/insatisfeitos', authenticateToken, buscarInsatisfeitos); // Insatisfeitos e muito insatisfeitos

// Busca por campos específicos
router.get('/nome/:nome', authenticateToken, buscarPorNome); // Por nome
router.get('/provedor/:provedor', authenticateToken, buscarPorProvedor); // Por provedor
router.get('/bairro/:bairro', authenticateToken, buscarPesquisasPorBairro); // Por bairro

// CRUD
router.get('/:id', authenticateToken, buscarPesquisaPorId); // Por ID
router.put('/:id', authenticateToken, atualizarPesquisa); // Atualizar
router.delete('/:id', authenticateToken, deletarPesquisa); // Deletar

export default router;
