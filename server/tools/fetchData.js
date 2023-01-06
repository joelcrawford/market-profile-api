const moment = require('moment')
const _ = require('lodash')
const querystring = require('querystring')
const https = require('https')
const Candlestick = require('../dict/candlestick')

module.exports = {
    fetchData(endpoint, symbol, period, start, limit) {
        return new Promise((resolve, reject) => {
            const query = querystring.stringify({
                interval: period,
                symbol: symbol,
                limit: limit,
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
                        console.log('the body', body)
                        resolve(
                            JSON.parse(body).map((candle) => {
                                return new Candlestick(
                                    moment(candle[0]).format('x'),
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
    }
}
