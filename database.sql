-- Script de configuração do banco de dados para Pesquisa de Mercado
-- Execute este script no PostgreSQL para criar o banco e as tabelas

-- Criar banco de dados (execute como superuser)
-- CREATE DATABASE pesquisa_mercado;

-- Conectar ao banco criado
-- \c pesquisa_mercado

-- Criar tabela de pesquisas
CREATE TABLE IF NOT EXISTS pesquisas_mercado (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL UNIQUE,
    provedor_atual VARCHAR(255) NOT NULL,
    satisfacao VARCHAR(50) NOT NULL CHECK (satisfacao IN ('Muito satisfeito', 'Satisfeito', 'Insatisfeito', 'Muito insatisfeito')),
    bairro VARCHAR(255) NOT NULL,
    velocidade VARCHAR(100),
    valor_mensal VARCHAR(100) NOT NULL,
    uso_internet TEXT NOT NULL,
    interesse_proposta VARCHAR(50) NOT NULL CHECK (interesse_proposta IN ('Sim, tenho interesse', 'Não tenho interesse')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pesquisas_whatsapp ON pesquisas_mercado(whatsapp);
CREATE INDEX IF NOT EXISTS idx_pesquisas_bairro ON pesquisas_mercado(bairro);
CREATE INDEX IF NOT EXISTS idx_pesquisas_created_at ON pesquisas_mercado(created_at);
CREATE INDEX IF NOT EXISTS idx_pesquisas_interesse ON pesquisas_mercado(interesse_proposta);

-- Criar função para atualizar o timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_pesquisas_updated_at ON pesquisas_mercado;
CREATE TRIGGER update_pesquisas_updated_at
    BEFORE UPDATE ON pesquisas_mercado
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo (opcional)
INSERT INTO pesquisas_mercado (
    nome, 
    whatsapp, 
    provedor_atual, 
    satisfacao, 
    bairro, 
    velocidade, 
    valor_mensal, 
    uso_internet, 
    interesse_proposta
) VALUES 
    (
        'João Silva',
        '(11) 99999-9999',
        'Vivo',
        'Satisfeito',
        'Centro',
        '100 Mbps',
        'R$ 89,90',
        'Trabalho, Netflix, jogos online',
        'Sim, tenho interesse'
    ),
    (
        'Maria Santos',
        '(11) 88888-8888',
        'Claro',
        'Insatisfeito',
        'Jardim América',
        '50 Mbps',
        'R$ 120,00',
        'Estudo, redes sociais, streaming',
        'Sim, tenho interesse'
    ),
    (
        'Pedro Costa',
        '(11) 77777-7777',
        'Oi',
        'Muito insatisfeito',
        'Vila Nova',
        '25 Mbps',
        'R$ 95,00',
        'Trabalho remoto, videoconferências',
        'Sim, tenho interesse'
    )
ON CONFLICT (whatsapp) DO NOTHING;

-- Verificar se tudo foi criado corretamente
SELECT 
    'Tabela criada com sucesso!' as status,
    COUNT(*) as total_pesquisas
FROM pesquisas_mercado;

-- Mostrar estrutura da tabela
\d pesquisas_mercado
