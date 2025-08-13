import { Router } from 'express';
import { register, login, getProfile, refreshToken, validateToken } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rotas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Rotas protegidas
router.get('/profile', authenticateToken, getProfile);
router.get('/validate', authenticateToken, validateToken);

export default router;
