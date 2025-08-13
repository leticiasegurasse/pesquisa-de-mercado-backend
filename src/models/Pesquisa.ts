import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface PesquisaAttributes {
  id?: number;
  nome: string;
  whatsapp: string;
  provedor_atual: string;
  satisfacao: string;
  bairro: string;
  velocidade?: string;
  valor_mensal: string;
  uso_internet: string;
  interesse_proposta: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PesquisaCreationAttributes extends Omit<PesquisaAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Pesquisa extends Model<PesquisaAttributes, PesquisaCreationAttributes> implements PesquisaAttributes {
  public id!: number;
  public nome!: string;
  public whatsapp!: string;
  public provedor_atual!: string;
  public satisfacao!: string;
  public bairro!: string;
  public velocidade!: string;
  public valor_mensal!: string;
  public uso_internet!: string;
  public interesse_proposta!: string;
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
        notEmpty: true,
        len: [2, 100]
      }
    },
    whatsapp: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    provedor_atual: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    satisfacao: {
      type: DataTypes.ENUM('Muito satisfeito', 'Satisfeito', 'Insatisfeito', 'Muito insatisfeito'),
      allowNull: false
    },
    bairro: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    velocidade: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    valor_mensal: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    uso_internet: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    interesse_proposta: {
      type: DataTypes.ENUM('Sim, tenho interesse', 'Não tenho interesse'),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'pesquisas',
    timestamps: true
  }
);

export default Pesquisa;
