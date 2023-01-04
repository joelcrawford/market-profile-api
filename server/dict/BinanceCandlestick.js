const { binance } = require('../statics')
module.exports = class BinanceCandlestick {
    constructor(symbol, period, time, open, high, low, close, volume) {
        if (!['m', 'h', 'd', 'y'].includes(period.slice(-1))) {
            throw `Invalid candlestick period: ${period} - ${JSON.stringify(
                Object.values(arguments)
            )}`
        }

        // simple time validation
        time = parseInt(time)
        if (time <= 631148400) {
            throw `Invalid candlestick time given: ${time} - ${JSON.stringify(
                Object.values(arguments)
            )}`
        }

        // this.exchange = 'Binance'
        // this.symbol = symbol
        // this.period = period
        // this.time = time
        // this.open = parseFloat(open)
        // this.high = parseFloat(high)
        // this.low = parseFloat(low)
        // this.close = parseFloat(close)
        // this.volume = parseFloat(volume)
        this.exchange = binance.exchangeName
        this.symbol = symbol
        this.period = period
        this.time = time
        this.open = open
        this.high = high
        this.low = low
        this.close = close
        this.volume = volume
    }

    static createFromCandle(exchange, symbol, period, candle) {
        return new BinanceCandlestick(
            exchange,
            symbol,
            period,
            candle.time,
            candle.open,
            candle.high,
            candle.low,
            candle.close,
            candle.volume
        )
    }
}
