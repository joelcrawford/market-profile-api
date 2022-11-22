const express = require('express')
const router = express.Router()
const WebSocket = require('ws')
const { binance } = require('../statics')
//const fetch = require('node-fetch')

router.get(['/:id'], async (request, response) => {
    try {
        console.log('params', request.params)
        console.log('query', request.query)

        // Websocket connection for streaming data
        const ws = new WebSocket(
            `${binance.futures}${request.params.id}@${binance.streamTypes.klines.oneMinute}`
        )
        console.log(
            `${binance.futures}${request.params.id}@${binance.streamTypes.klines.oneMinute}`
        )

        let count = 0
        let data
        // ws.on('message', (msg) => {
        //     if (msg && count < 2) {
        //         const data = JSON.parse(msg) // parsing a single-trade record
        //         console.log(data)
        //         ++count
        //     }
        //     // now how do i send this stream to the database?
        // })
        ws.on('message', (msg) => {
            if (msg && count < 2) {
                data = JSON.parse(msg) // parsing a single-trade record
                console.log('data from route', data)
                ++count
            }
        })

        // ws.on('connection', (ws) => {
        //     console.log('connected to binance stream')
        //     ws.on('message', (msg) => {
        //         if (msg && count < 2) {
        //             data = JSON.parse(msg) // parsing a single-trade record
        //             console.log(data)
        //             ++count
        //         }
        //     })

        //     //ws.send('something')
        // })
        if (data) {
            response.send({ msg: 'Data received' })
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router
