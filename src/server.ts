import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/db';
import authRoutes from './routes/auth.routes';
import pesquisaRoutes from './routes/pesquisa.routes';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();

// Middlewares de segurança e parsing
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/pesquisas', pesquisaRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API de Pesquisa de Mercado funcionando! 🚀' });
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware para rotas não encontradas (deve vir antes do errorHandler)
app.use(notFoundHandler);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Conexão com banco de dados
sequelize.authenticate()
  .then(() => console.log('✅ Conexão com o banco de dados estabelecida com sucesso.'))
  .catch(err => console.error('❌ Não foi possível conectar ao banco de dados:', err));

const PORT = process.env.PORT || '3001';

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📝 Endpoints disponíveis:`);
  console.log(`   🔐 Autenticação:`);
  console.log(`      POST /api/auth/register - Registrar usuário`);
  console.log(`      POST /api/auth/login - Fazer login`);
  console.log(`      POST /api/auth/logout - Fazer logout`);
  console.log(`      POST /api/auth/refresh - Renovar token`);
  console.log(`      POST /api/auth/forgot-password - Esqueci a senha`);
  console.log(`      POST /api/auth/reset-password - Redefinir senha`);
  console.log(`      GET  /api/auth/verify-token - Verificar token (protegido)`);
  console.log(`      GET  /api/auth/profile - Perfil do usuário (protegido)`);
  console.log(`      PUT  /api/auth/profile - Atualizar perfil (protegido)`);
  console.log(`      POST /api/auth/change-password - Alterar senha (protegido)`);
  console.log(`   📊 Pesquisas:`);
  console.log(`      POST /api/pesquisas - Criar pesquisa`);
  console.log(`      GET  /api/pesquisas - Listar pesquisas`);
  console.log(`      GET  /api/pesquisas/estatisticas - Estatísticas`);
  console.log(`      GET  /api/pesquisas/interessados - Apenas interessados`);
  console.log(`      GET  /api/pesquisas/nao-interessados - Apenas não interessados`);
  console.log(`      GET  /api/pesquisas/satisfeitos - Apenas satisfeitos`);
  console.log(`      GET  /api/pesquisas/insatisfeitos - Apenas insatisfeitos`);
  console.log(`      GET  /api/pesquisas/verificar-whatsapp/:whatsapp - Verificar WhatsApp`);
  console.log(`      GET  /api/pesquisas/verificar-cpf/:cpf - Verificar CPF`);
  console.log(`      GET  /api/pesquisas/:id - Buscar pesquisa por ID`);
  console.log(`   🏥 Sistema:`);
  console.log(`      GET  /api/health - Health check`);
});

export default app;
