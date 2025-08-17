import { Request, Response } from 'express';
import authService from '../services/authService';

class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      
      const result = await authService.register({ name, email, password });
      
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        data: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno do servidor';
      res.status(400).json({ error: message });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      const result = await authService.login({ email, password });
      
      res.status(200).json({
        message: 'Login realizado com sucesso',
        data: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno do servidor';
      res.status(401).json({ error: message });
    }
  }

  public async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const user = await authService.getUserById(userId);
      
      res.status(200).json({
        message: 'Perfil recuperado com sucesso',
        data: user
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno do servidor';
      res.status(404).json({ error: message });
    }
  }

  public async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: 'Token inválido' });
        return;
      }

      const user = await authService.getUserById(userId);
      
      res.status(200).json({
        message: 'Token válido',
        data: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno do servidor';
      res.status(401).json({ error: message });
    }
  }
}

export default new AuthController();
