import app from './app';
import sequelize from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const isProd = process.env.NODE_ENV === 'production';
const shouldSyncAlter = !isProd && (process.env.DB_SYNC_ALTER?.toLowerCase() === 'true');

let httpServer: ReturnType<typeof app.listen> | null = null;

async function startServer() {
  try {
    // 1) Apenas autentica em qualquer ambiente
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');

    // 2) Em DEV, opcionalmente ajusta tabelas conforme models
    if (shouldSyncAlter) {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados com o banco de dados (dev alter).');
    } else {
      console.log('ℹ️ Sync automático desativado. Use migrations para evoluir o schema.');
    }

    // 3) Sobe servidor HTTP
    httpServer = app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 API de autenticação: http://localhost:${PORT}/api/auth`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });

    // Opcional: tratar erros do servidor HTTP
    httpServer.on('error', (err) => {
      console.error('❌ Erro no servidor HTTP:', err);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

// === Graceful shutdown ===
async function shutdown(code = 0) {
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
