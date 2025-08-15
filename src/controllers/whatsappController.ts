import { Request, Response } from 'express';
import whatsappService from '../services/whatsappService';

// Testar status da instância
export const testInstanceStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const isConnected = await whatsappService.checkInstanceStatus();
    
    res.status(200).json({
      success: true,
      message: isConnected ? 'Instância conectada' : 'Instância desconectada',
      data: {
        connected: isConnected
      }
    });
  } catch (error) {
    console.error('Erro ao testar status da instância:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar status da instância'
    });
  }
};

// Conectar instância
export const connectInstance = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await whatsappService.connectInstance();
    
    res.status(200).json({
      success,
      message: success ? 'Instância conectada com sucesso' : 'Erro ao conectar instância'
    });
  } catch (error) {
    console.error('Erro ao conectar instância:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao conectar instância'
    });
  }
};

// Testar envio de mensagem
export const testMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { number, message } = req.body;
    
    if (!number || !message) {
      res.status(400).json({
        success: false,
        message: 'Número e mensagem são obrigatórios'
      });
      return;
    }

    const success = await whatsappService.sendMessage({
      number,
      text: message
    });
    
    res.status(200).json({
      success,
      message: success ? 'Mensagem enviada com sucesso' : 'Erro ao enviar mensagem'
    });
  } catch (error) {
    console.error('Erro ao testar mensagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar mensagem de teste'
    });
  }
};

// Testar notificação de pesquisa
export const testPesquisaNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const pesquisaTeste = {
      nome: 'João Silva (Teste)',
      whatsapp: '(11) 99999-9999',
      provedor_atual: 'Vivo',
      satisfacao: 'Satisfeito',
      bairro: 'Centro',
      velocidade: '100 Mbps',
      valor_mensal: 'R$ 89,90',
      uso_internet: 'Trabalho, Netflix, jogos online',
      interesse_proposta: 'Sim, tenho interesse',
      responsavel: 'Leticia'
    };

    const success = await whatsappService.sendPesquisaNotification(pesquisaTeste);
    
    res.status(200).json({
      success,
      message: success ? 'Notificação de teste enviada com sucesso' : 'Erro ao enviar notificação de teste',
      data: {
        pesquisa: pesquisaTeste
      }
    });
  } catch (error) {
    console.error('Erro ao testar notificação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar notificação de teste'
    });
  }
};
