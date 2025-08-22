import { DataTypes, Model, Sequelize, Op } from 'sequelize';

// Interface para o modelo de Pesquisa
interface PesquisaAttributes {
    id?: number;
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
    createdAt?: Date;
    updatedAt?: Date;
}

// Modelo de Pesquisa
export default (sequelize: Sequelize) => {
    class Pesquisa extends Model<PesquisaAttributes> implements PesquisaAttributes {
        public id!: number;
        public nome!: string;
        public whatsapp!: string;
        public cpf?: string;
        public provedor_atual!: string;
        public satisfacao!: string;
        public bairro!: string;
        public velocidade?: string;
        public valor_mensal!: string;
        public uso_internet!: string;
        public interesse_proposta!: string;
        public responsavel!: string;
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }

    Pesquisa.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            nome: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    len: [2, 100],
                    notEmpty: true,
                },
            },
            whatsapp: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                },
            },
            cpf: {
                type: DataTypes.STRING(14),
                allowNull: true,
                unique: true,
                validate: {
                    len: [11, 14],
                },
            },
            provedor_atual: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            satisfacao: {
                type: DataTypes.ENUM('muito_satisfeito', 'satisfeito', 'neutro', 'insatisfeito', 'muito_insatisfeito'),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            bairro: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            velocidade: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            valor_mensal: {
                type: DataTypes.STRING(20),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            uso_internet: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            interesse_proposta: {
                type: DataTypes.ENUM('sim', 'nao'),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            responsavel: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
        },
        {
            sequelize,
            modelName: 'Pesquisa',
            tableName: 'pesquisas',
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ['whatsapp'],
                },
                {
                    unique: true,
                    fields: ['cpf'],
                    where: {
                        cpf: {
                            [Op.ne]: null
                        }
                    }
                },
                {
                    fields: ['bairro'],
                },
                {
                    fields: ['provedor_atual'],
                },
                {
                    fields: ['satisfacao'],
                },
                {
                    fields: ['interesse_proposta'],
                },
                {
                    fields: ['responsavel'],
                },
            ],
        }
    );

    return Pesquisa;
};
