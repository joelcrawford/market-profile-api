const { Model, DataTypes } = require('sequelize')
class BinanceKlines extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
                },
                exchange: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                symbol: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                period: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                time: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                open: {
                    type: DataTypes.FLOAT,
                    allowNull: false
                },
                close: {
                    type: DataTypes.FLOAT,
                    allowNull: false
                },
                low: {
                    type: DataTypes.FLOAT,
                    allowNull: false
                },
                high: {
                    type: DataTypes.FLOAT,
                    allowNull: false
                },
                volume: {
                    type: DataTypes.FLOAT,
                    allowNull: false
                }
            },
            {
                modelName: 'binance_klines',
                tableName: 'binance_klines',
                freezeTableName: true,
                timestamps: false,
                sequelize
            }
        )
    }
}

module.exports = BinanceKlines
