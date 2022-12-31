const db = require('../db/db')
const BinanceCandlestick = require('../dict/BinanceCandlestick')

let debug = {
    count: 0,
    on: false
}
let dataArray = []

//db.authenticate()

module.exports = {
    handleMessage(ws) {
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
        })
    }
}
