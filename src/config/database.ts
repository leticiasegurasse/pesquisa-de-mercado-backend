import { Sequelize, QueryTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'pesquisa_mercado',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false, // Logs SQL apenas quando DB_LOGGING=true
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || '10'),
    min: parseInt(process.env.DB_POOL_MIN || '0'),
    acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
    idle: parseInt(process.env.DB_POOL_IDLE || '10000')
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  },
  // Configurações adicionais para produção
  dialectOptions: {
    // Configurações específicas do PostgreSQL
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    // Configurações para evitar problemas de memória
    statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT || '30000'),
    query_timeout: parseInt(process.env.DB_QUERY_TIMEOUT || '30000'),
    // Configurações de conexão
    connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '30000'),
    // Configurações de lock
    lock_timeout: parseInt(process.env.DB_LOCK_TIMEOUT || '10000')
  }
});

export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
    throw error;
  }
};

// Função para verificar se as tabelas existem
const checkTablesExist = async (): Promise<boolean> => {
  try {
    // Verificar se a tabela users existe e tem a estrutura básica
    const usersResult = await sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name IN ('id', 'email', 'password')",
      { type: QueryTypes.SELECT }
    );
    
    // Verificar se a tabela pesquisas existe
    const pesquisasResult = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pesquisas'",
      { type: QueryTypes.SELECT }
    );
    
    const usersExist = usersResult.length >= 3; // id, email, password
    const pesquisasExist = pesquisasResult.length > 0;
    
    console.log(`📊 Status das tabelas: users=${usersExist}, pesquisas=${pesquisasExist}`);
    
    return usersExist && pesquisasExist;
  } catch (error) {
    console.log('⚠️ Erro ao verificar tabelas:', error);
    return false;
  }
};

export const syncDatabase = async (): Promise<void> => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const tablesExist = await checkTablesExist();
    
    if (tablesExist) {
      // Se as tabelas já existem, não fazer nenhuma sincronização
      console.log('✅ Tabelas já existem. Pulando sincronização.');
      return;
    }
    
    if (isProduction) {
      // Em produção sem tabelas, criar estrutura manualmente
      console.log('⚠️ Tabelas não encontradas em produção. Criando estrutura manualmente...');
      await createTablesManually();
      console.log('✅ Estrutura criada manualmente em produção.');
    } else {
      // Em desenvolvimento sem tabelas, tentar sincronização normal primeiro
      console.log('⚠️ Tabelas não encontradas em desenvolvimento. Tentando sincronização normal...');
      try {
        await sequelize.sync({ force: false, alter: false });
        console.log('✅ Estrutura criada via sincronização em desenvolvimento.');
      } catch (syncError) {
        console.log('⚠️ Sincronização falhou, tentando criação manual...');
        await createTablesManually();
        console.log('✅ Estrutura criada manualmente em desenvolvimento.');
      }
    }
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error);
    
    // Se for erro de memória compartilhada, tentar uma abordagem mais conservadora
    if (error instanceof Error && (error.message.includes('out of shared memory') || error.message.includes('53200'))) {
      console.log('⚠️ Erro de memória compartilhada detectado. Tentando sincronização conservadora...');
      try {
        // Tentar apenas verificar se as tabelas existem
        const tablesExist = await checkTablesExist();
        if (tablesExist) {
          console.log('✅ Tabelas existem. Continuando sem sincronização.');
          return;
        } else {
          console.log('⚠️ Tabelas não existem. Tentando criar estrutura manualmente...');
          await createTablesManually();
          console.log('✅ Estrutura criada manualmente.');
        }
      } catch (conservativeError) {
        console.error('❌ Erro na sincronização conservadora:', conservativeError);
        console.log('⚠️ Continuando sem sincronização. Verifique se as tabelas existem manualmente.');
        // Em produção, não falhar completamente se a sincronização falhar
        if (process.env.NODE_ENV !== 'production') {
          throw conservativeError;
        }
      }
    } else {
      throw error;
    }
  }
};

// Função para criar tabelas manualmente se necessário
const createTablesManually = async (): Promise<void> => {
  try {
    console.log('🔧 Criando tabelas manualmente...');
    
    // Criar tabela users
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Criar tabela pesquisas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS pesquisas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefone VARCHAR(20) NOT NULL,
        empresa VARCHAR(255),
        cargo VARCHAR(255),
        setor VARCHAR(255),
        tamanho_empresa VARCHAR(100),
        desafios TEXT,
        solucoes_interesse TEXT,
        orcamento VARCHAR(100),
        timeline VARCHAR(100),
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Tabelas criadas manualmente com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas manualmente:', error);
    throw error;
  }
};

export default sequelize;
