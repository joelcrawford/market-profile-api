const { Op } = require('sequelize')
const db = require('../db/db')

//const sequelize = new Sequelize()
const { sequelize, binance_klines } = db

module.exports = {
    async selectStats(params, query) {
        const exchange = params.x

        let whereClause = {
            exchange: exchange
        }

        let instruments = []
        if (query.instruments) {
            // split at comma
            instruments = query.instruments.split(',')
            whereClause['symbol'] = {
                [Op.in]: instruments
            }
        }
        console.log('where', whereClause)
        const data = await binance_klines.findAll({
            attributes: [
                'exchange',
                'symbol',
                [sequelize.fn('MIN', sequelize.col('time')), 'earliest'],
                [sequelize.fn('MAX', sequelize.col('time')), 'latest'],
                [sequelize.fn('COUNT', sequelize.col('symbol')), 'count']
            ],
            where: whereClause,
            group: ['symbol', 'exchange']
        })

        return data
        // SELECT min(time) as first_time, max(time) as latest_time FROM binance_klines
        // WHERE exchange = X AND symbol = Y;
    }
}
