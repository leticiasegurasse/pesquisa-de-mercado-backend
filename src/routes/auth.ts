import { Router } from 'express';
import { register, login, getProfile, refreshToken } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rotas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Rota protegida para obter perfil do usuário
router.get('/profile', authenticateToken, getProfile);

export default router;
