const WebSocket = require('ws')
const { handleError } = require('./handleError')
const { handleOpen } = require('./handleOpen')
const { handleClose } = require('./handleClose')
const { handleMessage } = require('./handleMessage')
const { binance, coins } = require('../statics')

module.exports = {
    startWebsocket() {
        // Websocket, set up connection for binance stream -----------------
        const ws = new WebSocket(
            `${binance.futures}${coins}@${binance.streamTypes.klines.oneMinute}`
        )
        handleOpen(ws)
        handleClose(ws)
        handleError(ws)
        // main function ----------
        handleMessage(ws)
    }
}
