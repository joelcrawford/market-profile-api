module.exports = {
    handleError(ws) {
        ws.on('error', (e) => {
            console.log('error', e)
        })
    }
}
