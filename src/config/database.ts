import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do pool de conexões
const poolConfig: PoolConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pesquisa-mercado',
  password: process.env.DB_PASSWORD || 'adminpostgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  max: 20, // máximo de conexões no pool
  idleTimeoutMillis: 30000, // tempo limite de inatividade
  connectionTimeoutMillis: 2000, // tempo limite de conexão
};

// Criar pool de conexões
const pool = new Pool(poolConfig);

// Testar conexão
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Conectado ao banco de dados PostgreSQL');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão com o banco de dados:', error);
    return false;
  }
};

// Criar tabelas se não existirem
export const createTables = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    
    // Criar tabela de pesquisas
    await client.query(`
      CREATE TABLE IF NOT EXISTS pesquisas_mercado (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        whatsapp VARCHAR(20) UNIQUE NOT NULL,
        provedor_atual VARCHAR(255) NOT NULL,
        satisfacao VARCHAR(50) NOT NULL CHECK (satisfacao IN ('Muito satisfeito', 'Satisfeito', 'Insatisfeito', 'Muito insatisfeito')),
        bairro VARCHAR(255) NOT NULL,
        velocidade VARCHAR(100),
        valor_mensal VARCHAR(100) NOT NULL,
        uso_internet TEXT NOT NULL,
        interesse_proposta VARCHAR(50) NOT NULL CHECK (interesse_proposta IN ('Sim, tenho interesse', 'Não tenho interesse')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar índices para melhor performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_pesquisas_whatsapp ON pesquisas_mercado(whatsapp);
      CREATE INDEX IF NOT EXISTS idx_pesquisas_bairro ON pesquisas_mercado(bairro);
      CREATE INDEX IF NOT EXISTS idx_pesquisas_created_at ON pesquisas_mercado(created_at);
    `);

    // Criar trigger para atualizar updated_at
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_pesquisas_updated_at ON pesquisas_mercado;
      CREATE TRIGGER update_pesquisas_updated_at
        BEFORE UPDATE ON pesquisas_mercado
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    client.release();
    console.log('✅ Tabelas criadas/atualizadas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    throw error;
  }
};

// Fechar pool de conexões
export const closePool = async (): Promise<void> => {
  await pool.end();
};

export default pool;
