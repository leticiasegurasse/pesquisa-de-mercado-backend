// Tipos para a aplicação
export interface PesquisaMercado {
  id: number;
  nome: string;
  whatsapp: string;
  provedor_atual: string;
  satisfacao: string;
  bairro: string;
  velocidade?: string;
  valor_mensal: string;
  uso_internet: string;
  interesse_proposta: string;
  created_at: Date;
  updated_at: Date;
}

export type Satisfacao = 'Muito satisfeito' | 'Satisfeito' | 'Insatisfeito' | 'Muito insatisfeito';
export type InteresseProposta = 'Sim, tenho interesse' | 'Não tenho interesse';

// Tipo para criação de pesquisa (sem ID e timestamps)
export type CreatePesquisaInput = Omit<PesquisaMercado, 'id' | 'created_at' | 'updated_at'>;

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
