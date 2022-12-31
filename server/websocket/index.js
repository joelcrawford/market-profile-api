const WebSocket = require('ws')
const { handleError } = require('./handleError')
const { handleOpen } = require('./handleOpen')
const { handleClose } = require('./handleClose')
const { handleMessage } = require('./handleMessage')

module.exports = {
    startWebsocket(endpoint, coinPair, streamType) {
        // Websocket, set up connection for binance stream -----------------
        const ws = new WebSocket(`${endpoint}${coinPair}@${streamType}`)
        handleOpen(ws)
        handleClose(ws)
        handleError(ws)
        // main function ----------
        handleMessage(ws)
    }
}
