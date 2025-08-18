import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Função para criar conexão Sequelize
const createSequelize = () => {
  return new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'pesquisa_mercado',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  });
};

// Instância lazy-loaded
let sequelize: Sequelize | null = null;

const getSequelize = (): Sequelize => {
  if (!sequelize) {
    sequelize = createSequelize();
  }
  return sequelize;
};

export const testConnection = async (): Promise<void> => {
  try {
    const sequelize = getSequelize();
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
    throw error;
  }
};

export const syncDatabase = async (): Promise<void> => {
  try {
    const sequelize = getSequelize();
    await sequelize.sync({ alter: true });
    console.log('✅ Sincronização do banco de dados concluída.');
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error);
    throw error;
  }
};

export default getSequelize;
