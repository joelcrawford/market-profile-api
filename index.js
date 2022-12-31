require('dotenv').config()

const { binance } = require('./server/statics')
const { fetchData, insertData } = require('./server/controllers/fetchData')
const { getTimes } = require('./server/queries/selectWhere')
const { getTimes2 } = require('./server/queries/selectTest')

// TESTING HTTPS GET on Spot ------------------------

/*
symbol	STRING	YES	
interval	ENUM	YES	
startTime	LONG	NO	
endTime	LONG	NO	
limit	INT	NO	Default 500; max 1000

If startTime and endTime are not sent, the most recent klines are returned.

RESPONSE --------
[
  [
    1499040000000,      // Kline open time
    "0.01634790",       // Open price
    "0.80000000",       // High price
    "0.01575800",       // Low price
    "0.01577100",       // Close price
    "148976.11427815",  // Volume
    1499644799999,      // Kline Close time
    "2434.19055334",    // Quote asset volume
    308,                // Number of trades
    "1756.87402397",    // Taker buy base asset volume
    "28.46694368",      // Taker buy quote asset volume
    "0"                 // Unused field, ignore.
  ]
]


*/

/*
get 500 1m klines at a time
starting from latest point in data (query db)
milliseconds looks like this 1669282740000
1 minute = 60000 msecs
500 1m klines = 500 * 60000 = 30,000,000

[
    1669282740000,      // open time
    '296.80000000',     // O
    '297.00000000',     // H
    '296.80000000',     // L
    '296.90000000',     // C
    '60.06200000',      // V
    1669282799999,      // close time
    '17830.88470000', 
    44,              
    '32.67600000',
    '9701.70850000', 
    '0'
  ]

*/

let startTime = new Date('12/01/2022 00:00:00').getTime()
let x = 0
const recordLimit = 500
const timeMap = {
    one_minute: 60000
}
let timeMultiplier = recordLimit * timeMap.one_minute
// while (startTime <= Date.now()) {
//     let p = {
//         symbol: 'BNBBUSD',
//         interval: '1m',
//         startTime: startTime,
//         endTime: Date.now()
//     }
//     fetchData(binance.spot.endpoint, p).then((res) => {
//         insertData(res, 'BNBBUSD')
//     })
//     startTime += timeMultiplier
//     x++
//     //console.log(x, startTime)
// }

fetchData(`${binance.baseUrl}${binance.infoUrl}`).then((res) => {
    console.log(res.rateLimits)
})
// let res = null

//console.log(res.length)
//getTimes('Binance', 'BTCUSDT').then((res) => console.log(res))
//const tt = getTimes2()
//console.log(t)
