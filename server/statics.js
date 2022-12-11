module.exports = {
    // TD Ameritrade API endpoints
    tda: {
        baseUrl: 'https://api.tdameritrade.com/v1'
    },
    binance: {
        futures: 'wss://fstream.binance.com/ws/',
        klines: 'https://dapi.binance.com/dapi/v1/klines',
        spot: 'https://api3.binance.com/api/v3/klines',
        streamTypes: {
            book: 'bookTicker',
            trade: 'trade',
            aggTrade: 'aggTrade',
            klines: {
                oneMinute: 'kline_1m',
                fiveMinute: 'kline_5m'
            }
        }
    },
    coins: 'btcusdt'
}
