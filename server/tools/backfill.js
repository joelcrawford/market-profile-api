const Candlestick = require('../dict/candlestick')
const moment = require('moment')
const _ = require('lodash')
const ExchangeCandlestick = require('../dict/exchange_candlestick')

module.exports = {
    async backfill(exchangeName, symbol, period, date) {
        const exchange = exchangeName
        if (!exchange) {
            throw `Exchange not found: ${exchangeName}`
        }

        let start = moment().subtract(date, 'days')
        let candles

        do {
            console.log(`Since: ${new Date(start).toISOString()}`)
            candles = await exchangeBackfill(symbol, period, start)

            const exchangeCandlesticks = candles.map((candle) => {
                return ExchangeCandlestick.createFromCandle(
                    exchangeName,
                    symbol,
                    period,
                    candle
                )
            })

            await this.candleImporter.insertCandles(exchangeCandlesticks)

            console.log(`Got: ${candles.length} candles`)

            start = new Date(_.max(candles.map((r) => r.time)) * 1000)
        } while (candles.length > 10)

        console.log('finish')
    },
    exchangeBackfill(symbol, period, start) {
        const symbolUpdated = symbol.replace('_PERP', '')

        return new Promise((resolve, reject) => {
            const query = querystring.stringify({
                interval: period,
                symbol: symbolUpdated,
                limit: 500,
                startTime: moment(start).valueOf()
            })

            request(
                `https://dapi.binance.com/dapi/v1/klines?${query}`,
                { json: true },
                (err, res, body) => {
                    if (err) {
                        console.log(
                            `Binance: Candle backfill error: ${String(err)}`
                        )
                        reject()
                        return
                    }

                    if (res.statusCode === 429) {
                        console.log(
                            `Binance: Limit reached: ${String(res.headers)}`
                        )
                        // TODO delay next execution
                        reject()
                        return
                    }

                    if (!Array.isArray(body)) {
                        console.log(
                            `Binance: Candle backfill error: ${JSON.stringify(
                                body
                            )}`
                        )
                        reject()
                        return
                    }

                    resolve(
                        body.map((candle) => {
                            return new Candlestick(
                                moment(candle[0]).format('X'),
                                candle[1],
                                candle[2],
                                candle[3],
                                candle[4],
                                candle[5]
                            )
                        })
                    )
                }
            )
        })
    }
}
