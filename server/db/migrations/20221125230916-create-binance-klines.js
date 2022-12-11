'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('binance_klines', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4 // Or DataTypes.UUIDV1
            },
            exchange: {
                type: Sequelize.STRING
            },
            symbol: {
                type: Sequelize.STRING
            },
            period: {
                type: Sequelize.STRING
            },
            time: {
                type: Sequelize.DATE
            },
            open: {
                type: Sequelize.FLOAT
            },
            close: {
                type: Sequelize.FLOAT
            },
            low: {
                type: Sequelize.FLOAT
            },
            high: {
                type: Sequelize.FLOAT
            },
            volume: {
                type: Sequelize.FLOAT
            }
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('binance_klines')
    }
}
