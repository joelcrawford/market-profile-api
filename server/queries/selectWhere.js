const { Op } = require('sequelize')
const db = require('../db/db')

//const sequelize = new Sequelize()
const { sequelize, binance_klines } = db

module.exports = {
    getTimes(X, Y) {
        const data = binance_klines
            .findAll({
                attributes: [
                    [sequelize.fn('MAX', sequelize.col('time')), 'latest_time'],
                    [sequelize.fn('MIN', sequelize.col('time')), 'first_time']
                ],
                where: {
                    [Op.and]: [{ exchange: X }, { symbol: Y }]
                }
            })
            .then((res) => {
                return res
            })
        return data
        // SELECT min(time) as first_time, max(time) as latest_time FROM binance_klines
        // WHERE exchange = X AND symbol = Y;
    }
}
