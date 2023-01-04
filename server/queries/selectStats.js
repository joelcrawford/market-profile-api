const { Op } = require('sequelize')
const db = require('../db/db')

//const sequelize = new Sequelize()
const { sequelize, binance_klines } = db

module.exports = {
    async selectStats() {
        const data = await binance_klines.findAll({
            attributes: [
                'exchange',
                'symbol',
                [sequelize.fn('MIN', sequelize.col('time')), 'earliest'],
                [sequelize.fn('MAX', sequelize.col('time')), 'latest'],
                [sequelize.fn('COUNT', sequelize.col('symbol')), 'count']
            ],
            group: ['symbol', 'exchange']
        })
        return data
        // SELECT min(time) as first_time, max(time) as latest_time FROM binance_klines
        // WHERE exchange = X AND symbol = Y;
    }
}
