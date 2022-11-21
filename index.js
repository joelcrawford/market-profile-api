require('dotenv').config()
const WebSocket = require('ws')
const server = require('./server')
const port = process.env.PORT || 6000

const pgPort = process.env.POSTGRES_PORT || 5432
const pgUser = process.env.POSTGRES_USER
const pgUserPassword = process.env.POSTGRES_USER_PASSWORD
const pgHost = process.env.POSTGRES_HOST

const Sequelize = require('sequelize')
const sequelize = new Sequelize(
    `postgres://${pgUser}:${pgUserPassword}@${pgHost}:${pgPort}/postgres`,
    {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
)

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err)
    })

server
    .listen(port, () => {
        console.log(
            `Listening on port ${port} in ${process.env.NODE_ENV} environment...`
        )
    })
    .on('error', (error) => {
        console.log(
            error,
            'Logging error to console. This is a nodemon error that recently started when I accidentally used yarn'
        )
    })

const coin = 'btcusdt'
const binanceStreamTypes = {
    book: 'bookTicker',
    trade: 'trade',
    aggTrade: 'aggTrade',
    klines: {
        oneMinute: 'kline_1m',
        fiveMinute: 'kline_5m'
    }
}

const ws = new WebSocket(
    `wss://fstream.binance.com/ws/${coin}@${binanceStreamTypes.klines.oneMinute}`
)

ws.on('message', (raw) => {
    if (raw) {
        const data = JSON.parse(raw) // parsing a single-trade record
        console.log(data)
    }
    // now how do i send this stream to the database?
})
