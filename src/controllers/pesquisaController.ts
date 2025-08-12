import { Request, Response } from 'express';
import pesquisaService from '../services/pesquisaService';
import { CreatePesquisaInput } from '../types';

class PesquisaController {
  // Criar nova pesquisa
  async createPesquisa(req: Request, res: Response) {
    try {
      const pesquisaData: CreatePesquisaInput = req.body;

      // Verificar se o WhatsApp já foi usado
      const whatsappExists = await pesquisaService.checkWhatsAppExists(pesquisaData.whatsapp);
      if (whatsappExists) {
        return res.status(400).json({
          success: false,
          message: 'Este número de WhatsApp já foi usado em uma pesquisa anterior'
        });
      }

      const result = await pesquisaService.createPesquisa(pesquisaData);

      if (result.success) {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error: any) {
      console.error('❌ Erro no controller createPesquisa:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // Buscar todas as pesquisas
  async getAllPesquisas(req: Request, res: Response) {
    try {
      const result = await pesquisaService.getAllPesquisas();

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error: any) {
      console.error('❌ Erro no controller getAllPesquisas:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // Buscar pesquisa por ID
  async getPesquisaById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID da pesquisa é obrigatório'
        });
      }
      
      const result = await pesquisaService.getPesquisaById(parseInt(id));

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json(result);
      }
    } catch (error: any) {
      console.error('❌ Erro no controller getPesquisaById:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // Buscar pesquisas por bairro
  async getPesquisasByBairro(req: Request, res: Response) {
    try {
      const { bairro } = req.query;
      const result = await pesquisaService.getPesquisasByBairro(bairro as string);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error: any) {
      console.error('❌ Erro no controller getPesquisasByBairro:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // Obter estatísticas
  async getEstatisticas(req: Request, res: Response) {
    try {
      const result = await pesquisaService.getEstatisticas();

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error: any) {
      console.error('❌ Erro no controller getEstatisticas:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // Health check
  async healthCheck(req: Request, res: Response) {
    try {
      return res.status(200).json({
        success: true,
        message: 'API funcionando corretamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    } catch (error: any) {
      console.error('❌ Erro no health check:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro no health check',
        error: error.message
      });
    }
  }
}

export default new PesquisaController();
