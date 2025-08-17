import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const shouldSyncAlter =
  !isProd && (process.env.DB_SYNC_ALTER?.toLowerCase() === 'true'); // dev only

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'auth_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  logging: !isProd && process.env.DB_LOG_SQL === 'true' ? console.log : false,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || (isProd ? '15' : '5'), 10),
    min: parseInt(process.env.DB_POOL_MIN || '0', 10),
    acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000', 10),
    idle: parseInt(process.env.DB_POOL_IDLE || (isProd ? '5000' : '10000'), 10),
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
  dialectOptions: (() => {
    // Ative SSL quando estiver em um banco gerenciado (Railway, Render, RDS, etc.)
    if (process.env.DB_SSL?.toLowerCase() === 'true') {
      return {
        ssl: {
          require: true,
          rejectUnauthorized:
            process.env.DB_SSL_REJECT_UNAUTHORIZED?.toLowerCase() === 'true',
        },
      };
    }
    return {};
  })(),
});

export default sequelize;

/**
 * Chame isto no bootstrap do servidor (antes de ouvir a porta).
 * Em produção: só autentica.
 * Em desenvolvimento: se DB_SYNC_ALTER=true, sincroniza (alter) para facilitar.
 */
export async function initDatabase() {
  await sequelize.authenticate();

  if (shouldSyncAlter) {
    await sequelize.sync({ alter: true });
    console.log('✅ Models sincronizados (dev alter).');
  } else {
    console.log('✅ Conexão autenticada.');
  }
}
