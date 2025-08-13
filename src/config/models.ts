import sequelize from './database';
import User from '../models/User';
import Pesquisa from '../models/Pesquisa';

// Função para inicializar todos os modelos
export const initializeModels = () => {
  // Os modelos já são inicializados automaticamente quando importados
  // Esta função garante que todos os modelos sejam carregados
  console.log('📋 Modelos carregados:');
  console.log('  - User');
  console.log('  - Pesquisa');
};

// Exportar modelos para uso em outros arquivos
export { User, Pesquisa };
