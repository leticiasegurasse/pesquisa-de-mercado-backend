// Importar tipos do Prisma
import { PesquisaMercado, Satisfacao, InteresseProposta } from '@prisma/client';

// Re-exportar tipos do Prisma
export type { PesquisaMercado, Satisfacao, InteresseProposta };

// Tipo para criação de pesquisa (sem ID e timestamps)
export type CreatePesquisaInput = Omit<PesquisaMercado, 'id' | 'created_at' | 'updated_at'>;

// Mapeamento de strings para enums
export const SATISFACAO_MAP = {
  'Muito satisfeito': 'MUITO_SATISFEITO' as const,
  'Satisfeito': 'SATISFEITO' as const,
  'Insatisfeito': 'INSATISFEITO' as const,
  'Muito insatisfeito': 'MUITO_INSATISFEITO' as const,
} as const;

export const INTERESSE_MAP = {
  'Sim, tenho interesse': 'SIM_INTERESSE' as const,
  'Não tenho interesse': 'NAO_INTERESSE' as const,
} as const;

// Tipos para a API Evolution
export interface EvolutionMessage {
  number: string;
  text: string;
  options?: {
    delay?: number;
    presence?: 'composing' | 'recording' | 'paused';
  };
}

export interface EvolutionResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

// Tipos para respostas da API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Tipos para configurações do banco
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

// Tipos para configurações da Evolution API
export interface EvolutionConfig {
  url: string;
  apiKey: string;
  instance: string;
}
