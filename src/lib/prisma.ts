import { PrismaClient } from '@prisma/client';

// Cliente global do Prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Criação do cliente Prisma com logs em desenvolvimento
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Evita múltiplas instâncias em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Função para testar a conexão
export const testConnection = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados PostgreSQL via Prisma');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão com o banco de dados:', error);
    return false;
  }
};

// Função para desconectar
export const disconnect = async (): Promise<void> => {
  await prisma.$disconnect();
};

// Middleware para logs de performance
prisma.$use(async (params: any, next: any) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Query ${params.model}.${params.action} executada em ${after - before}ms`);
  }
  
  return result;
});

export default prisma;
