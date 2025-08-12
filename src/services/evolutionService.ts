import axios, { AxiosInstance } from 'axios';
import { EvolutionMessage, EvolutionResponse, EvolutionConfig } from '../types';

class EvolutionService {
  private api: AxiosInstance;
  private config: EvolutionConfig;

  constructor() {
    this.config = {
      url: process.env.EVOLUTION_API_URL || '',
      apiKey: process.env.EVOLUTION_API_KEY || '',
      instance: process.env.EVOLUTION_INSTANCE || ''
    };

    this.api = axios.create({
      baseURL: this.config.url,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.config.apiKey
      },
      timeout: 30000
    });

    // Interceptor para logs
    this.api.interceptors.request.use(
      (config) => {
        console.log(`📤 Enviando requisição para Evolution API: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Erro na requisição Evolution API:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ Resposta da Evolution API: ${response.status}`);
        return response;
      },
      (error) => {
        console.error('❌ Erro na resposta Evolution API:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Enviar mensagem de texto
  async sendTextMessage(number: string, text: string): Promise<EvolutionResponse> {
    try {
      const message: EvolutionMessage = {
        number: this.formatPhoneNumber(number),
        text,
        options: {
          delay: 1000,
          presence: 'composing'
        }
      };

      const response = await this.api.post(
        `/message/sendText/${this.config.instance}`,
        message
      );

      return {
        success: true,
        message: 'Mensagem enviada com sucesso',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erro ao enviar mensagem'
      };
    }
  }

  // Enviar mensagem de pesquisa recebida
  async sendPesquisaNotification(pesquisa: any): Promise<EvolutionResponse> {
    const message = this.formatPesquisaMessage(pesquisa);
    return this.sendTextMessage(process.env.EMPRESA_WHATSAPP || '', message);
  }

  // Formatar número de telefone
  private formatPhoneNumber(phone: string): string {
    // Remove caracteres especiais e adiciona código do país se necessário
    let formatted = phone.replace(/\D/g, '');
    
    // Se não tem código do país, adiciona 55 (Brasil)
    if (!formatted.startsWith('55')) {
      formatted = '55' + formatted;
    }
    
    return formatted;
  }

  // Formatar mensagem da pesquisa
  private formatPesquisaMessage(pesquisa: any): string {
    const emoji = '📊';
    const title = `${emoji} *NOVA PESQUISA DE MERCADO RECEBIDA* ${emoji}\n\n`;
    
    const content = `
*👤 Nome:* ${pesquisa.nome}
*📱 WhatsApp:* ${pesquisa.whatsapp}
*🏠 Bairro:* ${pesquisa.bairro}

*🌐 Provedor Atual:* ${pesquisa.provedor_atual}
*😊 Satisfação:* ${pesquisa.satisfacao}
*💰 Valor Mensal:* ${pesquisa.valor_mensal}
${pesquisa.velocidade ? `*⚡ Velocidade:* ${pesquisa.velocidade}\n` : ''}

*💻 Uso da Internet:* ${pesquisa.uso_internet}

*🎯 Interesse em Proposta:* ${pesquisa.interesse_proposta}

*📅 Data:* ${new Date().toLocaleString('pt-BR')}
    `.trim();

    return title + content;
  }

  // Verificar status da instância
  async checkInstanceStatus(): Promise<EvolutionResponse> {
    try {
      const response = await this.api.get(`/instance/connectionState/${this.config.instance}`);
      
      return {
        success: true,
        message: 'Status da instância verificado',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erro ao verificar status'
      };
    }
  }

  // Obter QR Code (se necessário)
  async getQRCode(): Promise<EvolutionResponse> {
    try {
      const response = await this.api.get(`/instance/connect/${this.config.instance}`);
      
      return {
        success: true,
        message: 'QR Code obtido com sucesso',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erro ao obter QR Code'
      };
    }
  }
}

export default new EvolutionService();
