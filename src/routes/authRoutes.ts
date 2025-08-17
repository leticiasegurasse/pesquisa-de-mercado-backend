import { Router } from 'express';
import authController from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validate, authSchemas } from '../middleware/validation';

const router = Router();

// Rota de registro
router.post('/register', validate(authSchemas.register), authController.register);

// Rota de login
router.post('/login', validate(authSchemas.login), authController.login);

// Rota para obter perfil do usuário (requer autenticação)
router.get('/profile', authenticateToken, authController.getProfile);

// Rota para validar token
router.get('/validate', authenticateToken, authController.validateToken);

export default router;
