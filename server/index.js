const express = require('express')
// Initialize...
const server = express()
server.use(express.json())

// auto encode URL params
server.use(
    express.urlencoded({
        extended: true
    })
)

const historical = require('./controllers/historical')
const binance = require('./controllers/binance_kline_stream')

// Historical Price Data
server.use('/historical', historical)
server.use('/binance', binance)
module.exports = server
