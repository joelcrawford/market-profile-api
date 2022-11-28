module.exports = {
    handleClose(ws) {
        ws.on('close', (code, reason) => {
            console.log('closed', code, reason.toString())
        })
    }
}
