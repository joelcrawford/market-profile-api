require('dotenv').config()
const WebSocket = require('ws')
const db = require('./server/db/db')
const { binance, coins } = require('./server/statics')
const BinanceCandlestick = require('./server/dict/BinanceCandlestick')

let debug = {
    count: 0,
    on: false
}
let dataArray = []

//db.authenticate()

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
        const data = JSON.parse(msg)
        if (data.e === 'kline' && data.s === 'BTCUSDT') {
            const c = data.k
            let k = new BinanceCandlestick(
                c.s,
                c.i,
                c.t,
                c.o,
                c.h,
                c.l,
                c.c,
                c.v
            )

            try {
                // insert the record
                if (dataArray.length >= 10) {
                    db.binance_klines.bulkCreate(dataArray)
                    dataArray = []
                } else {
                    dataArray.push(k)
                }
            } catch (e) {
                console.log('Error inserting data', e)
            }

            //db.dataArray.push(k)
            if (dataArray.length >= 100) {
                // send to postgres
            }
        }

        if (debug.on) {
            ++debug.count
            if (debug.count == 2) {
                ws.close()
            }
        }
    }

    // now how do i send this stream to the database?
})
