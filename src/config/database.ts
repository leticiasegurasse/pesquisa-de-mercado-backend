import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const shouldSyncAlter = !isProd && (process.env.DB_SYNC_ALTER?.toLowerCase() === 'true');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'auth_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  logging: !isProd && process.env.DB_LOG_SQL === 'true' ? console.log : false,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || (isProd ? '5' : '5'), 10),
    min: parseInt(process.env.DB_POOL_MIN || '0', 10),
    acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000', 10),
    idle: parseInt(process.env.DB_POOL_IDLE || (isProd ? '10000' : '10000'), 10),
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
  dialectOptions: (() => {
    // Configurações para banco gerenciado (Railway, Render, RDS, etc.)
    if (process.env.DB_SSL?.toLowerCase() === 'true') {
      return {
        ssl: {
          require: true,
          rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED?.toLowerCase() === 'true',
        },
      };
    }
    return {};
  })(),
});

export default sequelize;

/**
 * Inicializa o banco de dados
 * Na Vercel (serverless), apenas autentica
 */
export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');

    // Em desenvolvimento, opcionalmente sincroniza
    if (shouldSyncAlter) {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados (dev alter).');
    } else {
      console.log('ℹ️ Sync automático desativado. Use migrations para evoluir o schema.');
    }
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
    throw error;
  }
}
