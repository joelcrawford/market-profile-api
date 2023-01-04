const { Op } = require('sequelize')
const db = require('../db/db')
const { binance } = require('../statics')
const { backfill } = require('../tools/backfill')

//const sequelize = new Sequelize()
const { sequelize, binance_klines } = db

module.exports = {
    async selectStats(params, query) {
        const exchange = params.x

        let whereClause = {
            exchange: exchange
        }

        let instruments = []
        if (query.instrument) {
            // split at comma
            instruments = query.instrument.split(',')
            whereClause['symbol'] = {
                [Op.in]: instruments
            }
        }

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

        if (query.backfill && query.backfill === 'true' && instruments) {
            data.forEach((i) => {
                let startDate = i.dataValues.latest.valueOf()
                console.log(
                    `${i.dataValues.symbol}: ${new Date(startDate).toString(
                        'YYYY-MM-DD'
                    )}`
                )
                backfill(
                    'binance',
                    binance.spot.endpoint,
                    i.dataValues.symbol,
                    '1m',
                    startDate,
                    binance.rateLimits.max
                )
            })
        }

        return data
        // SELECT min(time) as first_time, max(time) as latest_time FROM binance_klines
        // WHERE exchange = X AND symbol = Y;
    }
}
