require('dotenv').config()
const WebSocket = require('ws')
const {
    handleError,
    handleOpen,
    handleClose,
    handleMessage
} = require('./server/events')
const { binance, coins } = require('./server/statics')

// Websocket, set up connection for bianance stream -----------------
const ws = new WebSocket(
    `${binance.futures}${coins}@${binance.streamTypes.klines.oneMinute}`
)

handleOpen(ws)
handleClose(ws)
handleError(ws)

// main function ----------
handleMessage(ws)
