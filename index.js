require('dotenv').config()
const WebSocket = require('ws')
const server = require('./server')
const port = process.env.PORT || 6000
const db = require('./server/clients/postgres')
const { binance, coins } = require('./server/statics')

// PostGreSQL
db.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err)
    })

// Express API endpoints
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

// // Websocket connection for streaming data
// const ws = new WebSocket(
//     `${binance.futures}${coins}@${binance.streamTypes.klines.oneMinute}`
// )

// let count = 0
// ws.on('message', (msg) => {
//     if (msg && count < 2) {
//         const data = JSON.parse(msg) // parsing a single-trade record
//         console.log(data)
//         ++count
//     }
//     // now how do i send this stream to the database?
// })
