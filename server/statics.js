const path = require('path')
module.exports = {
    google: {
        // If modifying these scopes, delete token.json.
        SCOPES: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        CREDENTIALS_PATH: path.join(__dirname, 'google/credentials.json'),
        TOKEN_PATH: path.join(__dirname, 'google')
    },
    // TD Ameritrade API endpoints
    tda: {
        baseUrl: 'https://api.tdameritrade.com/v1'
    },
    options: {
        backfill: {
            mostDays: 30,
            debug: 1
        },
        cron: {
            every_hour_at_30_mins: '30 */1 * * *',
            every_hour_at_45_mins: '45 */1 * * *',
            every_day_at_midnight: '0 0 * * *',
            every_day_at_one_fifteen: '15 13 * * *'
        }
    },
    binance: {
        exchangeName: 'binance',
        baseUrl: 'https://api3.binance.com',
        coinPairs: ['BNBBUSD', 'BTCBUSD', 'ETHBUSD', 'SOLBUSD'],
        futures: {
            endpoint: 'wss://fstream.binance.com/ws/'
        },
        klines: 'https://dapi.binance.com/dapi/v1/klines',
        spot: {
            endpoint: 'https://api3.binance.com/api/v3/klines',
            params: {
                symbol: 'BNBBTC',
                interval: '1m'
            }
        },
        infoUrl: '/api/v3/exchangeInfo',
        rateLimits: {
            debug: 12,
            max: 500
        },
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
