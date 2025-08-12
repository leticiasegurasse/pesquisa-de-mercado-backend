import pool from '../config/database';
import evolutionService from './evolutionService';
import { CreatePesquisaInput, ApiResponse, PesquisaMercado } from '../types';

class PesquisaService {
  // Criar nova pesquisa
  async createPesquisa(pesquisa: CreatePesquisaInput): Promise<ApiResponse> {
    try {
      const client = await pool.connect();
      
      // Verificar se WhatsApp já existe
      const existingWhatsApp = await client.query(
        'SELECT id FROM pesquisas_mercado WHERE whatsapp = $1',
        [pesquisa.whatsapp]
      );

      if (existingWhatsApp.rows.length > 0) {
        client.release();
        return {
          success: false,
          message: 'WhatsApp já cadastrado em outra pesquisa'
        };
      }

      // Inserir nova pesquisa
      const result = await client.query(`
        INSERT INTO pesquisas_mercado (
          nome, whatsapp, provedor_atual, satisfacao, bairro, 
          velocidade, valor_mensal, uso_internet, interesse_proposta
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        pesquisa.nome,
        pesquisa.whatsapp,
        pesquisa.provedor_atual,
        pesquisa.satisfacao,
        pesquisa.bairro,
        pesquisa.velocidade,
        pesquisa.valor_mensal,
        pesquisa.uso_internet,
        pesquisa.interesse_proposta
      ]);

      const novaPesquisa = result.rows[0];
      client.release();

      // Enviar notificação via WhatsApp
      try {
        await evolutionService.sendPesquisaNotification(novaPesquisa);
        console.log('✅ Notificação enviada via WhatsApp');
      } catch (whatsappError) {
        console.error('⚠️ Erro ao enviar notificação WhatsApp:', whatsappError);
        // Não falha a operação se o WhatsApp der erro
      }

      return {
        success: true,
        message: 'Pesquisa criada com sucesso',
        data: novaPesquisa
      };

    } catch (error: any) {
      console.error('❌ Erro ao criar pesquisa:', error);
      
      return {
        success: false,
        message: 'Erro ao criar pesquisa',
        error: error.message
      };
    }
  }

  // Buscar todas as pesquisas
  async getAllPesquisas(): Promise<ApiResponse> {
    try {
      const client = await pool.connect();
      const result = await client.query(`
        SELECT * FROM pesquisas_mercado 
        ORDER BY created_at DESC
      `);
      client.release();
      
      return {
        success: true,
        message: 'Pesquisas encontradas',
        data: result.rows
      };
    } catch (error: any) {
      console.error('❌ Erro ao buscar pesquisas:', error);
      
      return {
        success: false,
        message: 'Erro ao buscar pesquisas',
        error: error.message
      };
    }
  }

  // Buscar pesquisa por ID
  async getPesquisaById(id: number): Promise<ApiResponse> {
    try {
      const client = await pool.connect();
      const result = await client.query(
        'SELECT * FROM pesquisas_mercado WHERE id = $1',
        [id]
      );
      client.release();
      
      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Pesquisa não encontrada'
        };
      }
      
      return {
        success: true,
        message: 'Pesquisa encontrada',
        data: result.rows[0]
      };
    } catch (error: any) {
      console.error('❌ Erro ao buscar pesquisa:', error);
      
      return {
        success: false,
        message: 'Erro ao buscar pesquisa',
        error: error.message
      };
    }
  }

  // Buscar pesquisas por bairro
  async getPesquisasByBairro(bairro: string): Promise<ApiResponse> {
    try {
      const client = await pool.connect();
      const result = await client.query(`
        SELECT * FROM pesquisas_mercado 
        WHERE LOWER(bairro) LIKE LOWER($1)
        ORDER BY created_at DESC
      `, [`%${bairro}%`]);
      client.release();
      
      return {
        success: true,
        message: 'Pesquisas encontradas',
        data: result.rows
      };
    } catch (error: any) {
      console.error('❌ Erro ao buscar pesquisas por bairro:', error);
      
      return {
        success: false,
        message: 'Erro ao buscar pesquisas',
        error: error.message
      };
    }
  }

  // Obter estatísticas
  async getEstatisticas(): Promise<ApiResponse> {
    try {
      const client = await pool.connect();
      
      // Total de pesquisas
      const totalResult = await client.query('SELECT COUNT(*) as total FROM pesquisas_mercado');
      const total = parseInt(totalResult.rows[0].total);

      // Pesquisas de hoje
      const hojeResult = await client.query(`
        SELECT COUNT(*) as hoje FROM pesquisas_mercado 
        WHERE DATE(created_at) = CURRENT_DATE
      `);
      const hoje = parseInt(hojeResult.rows[0].hoje);

      // Estatísticas por satisfação
      const satisfacaoResult = await client.query(`
        SELECT satisfacao, COUNT(*) as quantidade 
        FROM pesquisas_mercado 
        GROUP BY satisfacao
      `);

      // Top 10 bairros
      const bairrosResult = await client.query(`
        SELECT bairro, COUNT(*) as quantidade 
        FROM pesquisas_mercado 
        GROUP BY bairro 
        ORDER BY quantidade DESC 
        LIMIT 10
      `);

      // Estatísticas por interesse
      const interesseResult = await client.query(`
        SELECT interesse_proposta, COUNT(*) as quantidade 
        FROM pesquisas_mercado 
        GROUP BY interesse_proposta
      `);

      client.release();

      return {
        success: true,
        message: 'Estatísticas obtidas com sucesso',
        data: {
          total,
          hoje,
          satisfacao: satisfacaoResult.rows,
          bairros: bairrosResult.rows,
          interesse: interesseResult.rows
        }
      };
    } catch (error: any) {
      console.error('❌ Erro ao obter estatísticas:', error);
      
      return {
        success: false,
        message: 'Erro ao obter estatísticas',
        error: error.message
      };
    }
  }

  // Verificar se WhatsApp já foi usado
  async checkWhatsAppExists(whatsapp: string): Promise<boolean> {
    try {
      const client = await pool.connect();
      const result = await client.query(
        'SELECT COUNT(*) as count FROM pesquisas_mercado WHERE whatsapp = $1',
        [whatsapp]
      );
      client.release();
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      console.error('❌ Erro ao verificar WhatsApp:', error);
      return false;
    }
  }
}

export default new PesquisaService();
