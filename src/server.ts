import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Importações locais
import pesquisaRoutes from './routes/pesquisaRoutes';
import { testConnection, prisma } from './lib/prisma';
import evolutionService from './services/evolutionService';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração de rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // máximo 100 requisições por janela
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares de segurança e performance
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());
app.use(limiter);

// Configuração do CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware de logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de tratamento de erros global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Rotas
app.use('/api', pesquisaRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Pesquisa de Mercado - G2 Telecom',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      pesquisas: '/api/pesquisas',
      estatisticas: '/api/estatisticas'
    }
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
    path: req.originalUrl
  });
});

// Função para inicializar o servidor
async function startServer() {
  try {
    // Testar conexão com o banco
    console.log('🔍 Testando conexão com o banco de dados...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Falha na conexão com o banco de dados');
      process.exit(1);
    }

    // Verificar se o banco está sincronizado
    console.log('🔧 Verificando sincronização do banco...');
    await prisma.$executeRaw`SELECT 1`;

    // Verificar status da Evolution API
    console.log('📱 Verificando status da Evolution API...');
    const evolutionStatus = await evolutionService.checkInstanceStatus();
    if (evolutionStatus.success) {
      console.log('✅ Evolution API conectada');
    } else {
      console.warn('⚠️ Evolution API não está disponível:', evolutionStatus.error);
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`
🚀 Servidor iniciado com sucesso!
📍 Porta: ${PORT}
🌍 Ambiente: ${process.env.NODE_ENV || 'development'}
📊 API: http://localhost:${PORT}
🔍 Health Check: http://localhost:${PORT}/api/health
      `);
    });

  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error);
    process.exit(1);
  }
}

// Tratamento de sinais para graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recebido. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recebido. Encerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
startServer();
