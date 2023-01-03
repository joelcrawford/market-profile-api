const _ = require('lodash')
const db = require('../db/db')
const BinanceCandlestick = require('../dict/BinanceCandlestick')

module.exports = {
    async backfill(exchangeName, endpoint, symbol, period, start, limit) {
        const exchange = exchangeName
        if (!exchange) {
            throw `Exchange not found: ${exchangeName}`
        }

        let candles

        do {
            console.log(
                `Since: ${new Date(start).toString(
                    'YYYY-MM-DD'
                )}, ${start}, ${typeof start}`
            )
            candles = await module.exports.fetchDataPromise(
                endpoint,
                symbol,
                period,
                start,
                limit
            )

            let dataArray = []
            candles.forEach((e) => {
                let k = new BinanceCandlestick(
                    symbol,
                    '1m',
                    e.time,
                    e.open,
                    e.high,
                    e.low,
                    e.close,
                    e.volume
                )

                dataArray.push(k)
            })

            try {
                db.binance_klines.bulkCreate(dataArray)
                dataArray = []
            } catch (error) {
                console.log('Error inserting data', error)
            }

            console.log(`Got: ${candles.length} candles`)

            //start = new Date(_.max(candles.map((r) => r.time))*1000)
            // get the last candle and add a minute (update to be 1 time period)
            start = +_.max(candles.map((r) => r.time)) + 60000
            console.log('the next start', start)
        } while (candles.length > 10)

        console.log('finish')
    }
}
