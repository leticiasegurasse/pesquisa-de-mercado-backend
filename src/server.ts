import app from './app';
import sequelize from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const isProd = process.env.NODE_ENV === 'production';
const shouldSyncAlter = !isProd && (process.env.DB_SYNC_ALTER?.toLowerCase() === 'true');

let httpServer: ReturnType<typeof app.listen> | null = null;
let shuttingDown = false;

// --- Rotas básicas aqui mesmo (podem ficar no app.ts se preferir) ---
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'API online',
    env: process.env.NODE_ENV || 'development',
  });
});
// --------------------------------------------------------------------

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');

    if (shouldSyncAlter) {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados com o banco de dados (dev alter).');
    } else {
      console.log('ℹ️ Sync automático desativado. Use migrations para evoluir o schema.');
    }

    httpServer = app.listen(PORT, HOST, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Health check: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/health`);
      console.log(`🔐 API de autenticação: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/api/auth`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });

    httpServer.on('error', (err) => {
      console.error('❌ Erro no servidor HTTP:', err);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

// === Graceful shutdown com proteção contra chamadas múltiplas ===
async function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  try {
    console.log('\n🛑 Encerrando servidor...');
    if (httpServer) {
      await new Promise<void>((resolve, reject) => {
        httpServer!.close((err?: Error) => (err ? reject(err) : resolve()));
      });
      console.log('🧹 HTTP server fechado.');
    }
    await sequelize.close();
    console.log('🧹 Conexão com banco fechada.');
    process.exit(code);
  } catch (err) {
    console.error('❌ Erro no shutdown:', err);
    process.exit(1);
  }
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  shutdown(1);
});

startServer();
