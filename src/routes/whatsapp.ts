import { Router } from 'express';
import {
  testInstanceStatus,
  connectInstance,
  testMessage,
  testPesquisaNotification
} from '../controllers/whatsappController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rotas públicas para teste básico
router.get('/status', testInstanceStatus); // Verificar status da instância
router.get('/connect', connectInstance); // Conectar instância

// Rotas protegidas (requerem autenticação)
router.post('/test-message', authenticateToken, testMessage); // Testar envio de mensagem
router.post('/test-notification', authenticateToken, testPesquisaNotification); // Testar notificação de pesquisa

export default router;
