require('dotenv').config()
const WebSocket = require('ws')
const axios = require('axios')

const {
    handleError,
    handleOpen,
    handleClose,
    handleMessage
} = require('./server/events')
const { binance, coins } = require('./server/statics')

// Websocket, set up connection for binance stream -----------------
const ws = new WebSocket(
    `${binance.futures}${coins}@${binance.streamTypes.klines.oneMinute}`
)

handleOpen(ws)
handleClose(ws)
handleError(ws)

// main function ----------
handleMessage(ws)

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

//const url = 'https://example.com'

// const data = {
//     name: 'Wade Wilson',
//     occupation: 'Murderer',
//     age: '30 (forever)'
// }

const getsomedata = async () => {
    const spotUrl = `${binance.spot}`
    console.log(spotUrl)

    const headers = {
        'Content-Type': 'application/json'
    }

    const params = {
        symbol: 'BNBBTC',
        interval: '1m'
    }

    try {
        let res = await axios(binance.spot, { method: 'GET', headers, params })
        console.log(res.data)
        // Work with the response...
    } catch (err) {
        if (err.response) {
            // The client was given an error response (5xx, 4xx)
        } else if (err.request) {
            // The client never received a response, and the request was never left
            console.log(err.request)
        } else {
            // Anything else
        }
    }
}

getsomedata()
