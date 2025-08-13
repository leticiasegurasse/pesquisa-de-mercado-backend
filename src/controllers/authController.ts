import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Validações básicas
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Nome, email e senha são obrigatórios'
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'A senha deve ter pelo menos 6 caracteres'
      });
      return;
    }

    // Verificar se o email já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'Email já cadastrado'
      });
      return;
    }

    // Criar novo usuário
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Gerar token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Gerar refresh token
    const refreshToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    }, '7d'); // Refresh token válido por 7 dias

    // Retornar dados do usuário (sem senha) e token
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        user: userResponse,
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validações básicas
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
      return;
    }

    // Buscar usuário pelo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
      return;
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Conta desativada'
      });
      return;
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
      return;
    }

    // Gerar token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Gerar refresh token
    const refreshToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    }, '7d'); // Refresh token válido por 7 dias

    // Retornar dados do usuário (sem senha) e token
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: userResponse,
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
      return;
    }

    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token é obrigatório'
      });
      return;
    }

    // Verificar refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;
    
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Usuário não encontrado ou inativo'
      });
      return;
    }

    // Gerar novo token
    const newToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Gerar novo refresh token
    const newRefreshToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    }, '7d');

    res.status(200).json({
      success: true,
      message: 'Token renovado com sucesso',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    res.status(401).json({
      success: false,
      message: 'Refresh token inválido'
    });
  }
};

// Validar token
export const validateToken = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
      return;
    }

    // Buscar usuário no banco para verificar se ainda existe e está ativo
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Usuário não encontrado ou inativo'
      });
      return;
    }

    // Retornar dados do usuário
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      message: 'Token válido',
      data: {
        user: userResponse
      }
    });
  } catch (error) {
    console.error('Erro ao validar token:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};
