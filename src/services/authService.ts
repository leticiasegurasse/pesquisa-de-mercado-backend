import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}

class AuthService {
  private generateToken(userId: number): string {
    const secret = process.env.JWT_SECRET || 'default_secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    
    return (jwt as any).sign({ userId }, secret, { expiresIn });
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('Usuário já existe com este email');
    }

    // Criar novo usuário
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password
    });

    // Atualizar último login
    await user.update({ lastLogin: new Date() });

    // Gerar token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    };
  }

  public async login(data: LoginData): Promise<AuthResponse> {
    // Buscar usuário pelo email
    const user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      throw new Error('Usuário inativo');
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new Error('Email ou senha inválidos');
    }

    // Atualizar último login
    await user.update({ lastLogin: new Date() });

    // Gerar token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    };
  }

  public async validateToken(token: string): Promise<{ userId: number }> {
    try {
      const secret = process.env.JWT_SECRET || 'default_secret';
      const decoded = (jwt as any).verify(token, secret) as { userId: number };
      
      // Verificar se o usuário ainda existe e está ativo
      const user = await User.findByPk(decoded.userId);
      if (!user || !user.isActive) {
        throw new Error('Token inválido');
      }

      return decoded;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  public async getUserById(userId: number) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  }
}

export default new AuthService();
