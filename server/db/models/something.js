const { Sequelize, Model, DataTypes } = require('sequelize')
class Something extends Model {
    static init(sequelize) {
        return super.init(
            {
                // field definitions
                something: DataTypes.STRING,
                time: {
                    type: DataTypes.DATE,
                    primaryKey: true
                }
            },
            {
                modelName: 'something',
                tableName: 'something',
                freezeTableName: true,
                timestamps: false,
                sequelize
            }
        )
    }
}

module.exports = Something
