import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
    class Event extends Model {
        public id!: number;
        public title!: string;
        public description!: string;
        public start_date!: Date;
        public end_date!: Date;
        public status!: string;
        public category_id!: number;
        public stripe_product_id?: string;
        public price_value?: number;
    }

    Event.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            start_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            end_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'pending',
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'event_categories',
                    key: 'id',
                },
            },
            stripe_product_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            price_value: {
                type: DataTypes.INTEGER, // Valor do preço em centavos
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Event',
            tableName: 'events',
            timestamps: true,
        }
    );

    return Event;
};