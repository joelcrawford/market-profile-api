require('dotenv').config()
const WebSocket = require('ws')
//const db = require('./server/clients/postgres')
const Database = require('./server/clients/postgres')
const { binance, coins } = require('./server/statics')
let debug = {
    count: 0,
    on: true
}
console.log(Database.setup())
// PostGreSQL, authenticate and connect -----------------------------

// await db
//     .authenticate()
//     .then(() => {
//         console.log('Connection to POSTGRES has been established successfully.')
//     })
//     .catch((err) => {
//         console.error('Unable to connect to the POSTGRES database:', err)
//     })

// Websocket, set up connection for bianance stream -----------------
const ws = new WebSocket(
    `${binance.futures}${coins}@${binance.streamTypes.klines.oneMinute}`
)

ws.on('open', () => {
    console.log('Connection to websocket open')
})
ws.on('close', (code, reason) => {
    console.log('closed', code, reason.toString())
})

ws.on('error', (e) => {
    console.log('error', e)
})

ws.on('message', (msg) => {
    if (msg) {
        const data = JSON.parse(msg) // parsing a single-trade record
        console.log(data)
        if (debug.on) {
            ++debug.count
            if (debug.count == 2) {
                ws.close()
            }
        }
    }

    // now how do i send this stream to the database?
})
