import axios from 'axios';

interface EvolutionAPIConfig {
  baseURL: string;
  apiKey: string;
  instanceName: string;
}

interface WhatsAppMessage {
  number: string;
  text: string;
}

interface PesquisaData {
  nome: string;
  whatsapp: string;
  cpf?: string;
  provedor_atual: string;
  satisfacao: string;
  bairro: string;
  velocidade?: string;
  valor_mensal: string;
  uso_internet: string;
  interesse_proposta: string;
  responsavel: string;
}

class WhatsAppService {
  private config: EvolutionAPIConfig;

  constructor() {
    this.config = {
      baseURL: process.env.EVOLUTION_API_URL || 'http://localhost:8080',
      apiKey: process.env.EVOLUTION_API_KEY || '',
      instanceName: process.env.EVOLUTION_INSTANCE_NAME || 'default'
    };
  }

  /**
   * Envia mensagem via WhatsApp
   */
  async sendMessage(message: WhatsAppMessage): Promise<boolean> {
    try {
      const url = `${this.config.baseURL}/message/sendText/${this.config.instanceName}`;
      
      const response = await axios.post(url, {
        number: message.number,
        text: message.text
      }, {
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.config.apiKey
        }
      });

      console.log('✅ Mensagem WhatsApp enviada:', response.data);
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao enviar mensagem WhatsApp:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Formata dados da pesquisa para mensagem WhatsApp
   */
  formatPesquisaMessage(pesquisa: PesquisaData): string {
    const emoji = {
      novo: '🆕',
      pessoa: '👤',
      telefone: '📱',
      documento: '📄',
      provedor: '🌐',
      satisfacao: '😊',
      localizacao: '📍',
      velocidade: '⚡',
      dinheiro: '💰',
      uso: '💻',
      interesse: '🎯',
      responsavel: '👨‍💼',
      separador: '━━━━━━━━━━━━━━━━━━━━'
    };

    return `${emoji.novo} *NOVA PESQUISA DE MERCADO*

${emoji.pessoa} *Nome:* ${pesquisa.nome}
${emoji.telefone} *WhatsApp:* ${pesquisa.whatsapp}
${pesquisa.cpf ? `${emoji.documento} *CPF:* ${pesquisa.cpf}` : ''}
${emoji.provedor} *Provedor Atual:* ${pesquisa.provedor_atual}
${emoji.satisfacao} *Satisfação:* ${pesquisa.satisfacao}
${emoji.localizacao} *Bairro:* ${pesquisa.bairro}
${emoji.velocidade} *Velocidade:* ${pesquisa.velocidade || 'Não informado'}
${emoji.dinheiro} *Valor Mensal:* ${pesquisa.valor_mensal}
${emoji.uso} *Uso da Internet:* ${pesquisa.uso_internet}
${emoji.interesse} *Interesse em Proposta:* ${pesquisa.interesse_proposta}
${emoji.responsavel} *Responsável:* ${pesquisa.responsavel}

${emoji.separador}
📊 *Dados coletados em:* ${new Date().toLocaleString('pt-BR')}
🏢 *Sistema:* Pesquisa de Mercado G2 Telecom`;
  }

  /**
   * Envia notificação de nova pesquisa para WhatsApp da empresa
   */
  async sendPesquisaNotification(pesquisa: PesquisaData): Promise<boolean> {
    try {
      const empresaWhatsApp = process.env.EMPRESA_WHATSAPP;
      
      if (!empresaWhatsApp) {
        console.warn('⚠️ WhatsApp da empresa não configurado');
        return false;
      }

      const message = this.formatPesquisaMessage(pesquisa);
      
      return await this.sendMessage({
        number: empresaWhatsApp,
        text: message
      });
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de pesquisa:', error);
      return false;
    }
  }

  /**
   * Verifica status da instância
   */
  async checkInstanceStatus(): Promise<boolean> {
    try {
      const url = `${this.config.baseURL}/instance/connectionState/${this.config.instanceName}`;
      
      const response = await axios.get(url, {
        headers: {
          'apikey': this.config.apiKey
        }
      });

      const isConnected = response.data.state === 'open';
      console.log(`📱 Status da instância WhatsApp: ${response.data.state}`);
      
      return isConnected;
    } catch (error: any) {
      console.error('❌ Erro ao verificar status da instância:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Conecta instância (se necessário)
   */
  async connectInstance(): Promise<boolean> {
    try {
      const url = `${this.config.baseURL}/instance/connect/${this.config.instanceName}`;
      
      const response = await axios.get(url, {
        headers: {
          'apikey': this.config.apiKey
        }
      });

      console.log('✅ Instância conectada:', response.data);
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao conectar instância:', error.response?.data || error.message);
      return false;
    }
  }
}

export default new WhatsAppService();
