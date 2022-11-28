module.exports = {
    handleOpen(ws) {
        ws.on('open', () => {
            console.log('Connection to websocket open')
        })
    }
}
