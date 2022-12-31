const axios = require('axios')
const moment = require('moment')
const _ = require('lodash')
const querystring = require('querystring')
const https = require('https')
const db = require('../db/db')
const BinanceCandlestick = require('../dict/BinanceCandlestick')
const Candlestick = require('../dict/candlestick')

module.exports = {
    fetchData(endpoint, params) {
        const headers = {
            'Content-Type': 'application/json'
        }

        try {
            return axios(endpoint, {
                method: 'GET',
                headers,
                params
            })
                .then((res) => res.data)
                .catch((err) => console.error(err))
        } catch (err) {
            if (err.response) {
                console.log('error response', err.response)
            } else if (err.request) {
                console.log('no response', err.request)
            } else {
                console.log('some other error...', err)
            }
        }
    },
    async backfill(exchangeName, endpoint, symbol, period) {
        const exchange = exchangeName
        if (!exchange) {
            throw `Exchange not found: ${exchangeName}`
        }

        let start = moment().subtract(7, 'days').valueOf()
        let candles

        do {
            console.log(`Since: ${new Date(start).toISOString()}`)
            candles = await module.exports.fetchDataPromise(
                endpoint,
                symbol,
                period,
                start
            )

            let dataArray = []
            candles.forEach((e) => {
                let k = new BinanceCandlestick(
                    symbol,
                    '1m',
                    e[0],
                    e[1],
                    e[2],
                    e[3],
                    e[4],
                    e[5]
                )
                dataArray.push(k)
            })
            console.log(dataArray[9])
            try {
                db.binance_klines.bulkCreate(dataArray)
                dataArray = []
            } catch (error) {
                console.log('Error inserting data', error)
            }

            console.log(`Got: ${candles.length} candles`)

            start = new Date(_.max(candles.map((r) => r.time)) * 1000)
            console.log('the next start', start.valueOf())
        } while (candles.length > 10)

        console.log('finish')
    },
    fetchDataPromise(endpoint, symbol, period, start) {
        return new Promise((resolve, reject) => {
            const query = querystring.stringify({
                interval: period,
                symbol: symbol,
                limit: 500,
                startTime: start
            })
            console.log(`${endpoint}?${query}`)
            //change to http for local testing
            const request = https.request(
                `${endpoint}?${query}`,
                (response) => {
                    //response.setEncoding('utf8')

                    let body = []

                    response.on('data', (chunk) => {
                        body = body + chunk
                    })

                    response.on('end', () => {
                        resolve(
                            JSON.parse(body).map((candle) => {
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
                        if (response.statusCode === 429) {
                            console.log(
                                `Binance: Limit reached: ${String(res.headers)}`
                            )
                            // TODO delay next execution
                            reject()
                            return
                        }
                        if (response.statusCode != 200) {
                            console.log(
                                'Api call failed with response code ' +
                                    response.statusCode
                            )
                            reject()
                            return
                        }
                    })
                }
            )

            request.on('error', (e) => {
                console.log('Error : ' + e.message)
                reject()
                return
            })

            // write data to request body
            //req.write(post_data)
            request.end()
        })
    },
    insertData(data, symbol) {
        // [
        //     1669282740000,      // open time
        //     '296.80000000',     // O
        //     '297.00000000',     // H
        //     '296.80000000',     // L
        //     '296.90000000',     // C
        //     '60.06200000',      // V
        //     1669282799999,      // close time
        //     '17830.88470000',
        //     44,
        //     '32.67600000',
        //     '9701.70850000',
        //     '0'
        //   ]

        // array of array, map each item to object
        let dataArray = []
        data.forEach((e) => {
            let k = new BinanceCandlestick(
                symbol,
                '1m',
                e[0],
                e[1],
                e[2],
                e[3],
                e[4],
                e[5]
            )
            dataArray.push(k)
        })
        try {
            db.binance_klines.bulkCreate(dataArray)
            dataArray = []
        } catch (error) {
            console.log('Error inserting data', error)
        }
    }
}
