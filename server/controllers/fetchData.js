const axios = require('axios')
const db = require('../db/db')
const BinanceCandlestick = require('../dict/BinanceCandlestick')

module.exports = {
    fetchData(endpoint, params) {
        const headers = {
            'Content-Type': 'application/json'
        }

        try {
            return axios(endpoint, {
                method: 'GET',
                headers,
                params
            })
                .then((res) => res.data)
                .catch((err) => console.error(err))
        } catch (err) {
            if (err.response) {
                console.log('error response', err.response)
            } else if (err.request) {
                console.log('no response', err.request)
            } else {
                console.log('some other error...', err)
            }
        }
    },
    insertData(data, symbol) {
        // [
        //     1669282740000,      // open time
        //     '296.80000000',     // O
        //     '297.00000000',     // H
        //     '296.80000000',     // L
        //     '296.90000000',     // C
        //     '60.06200000',      // V
        //     1669282799999,      // close time
        //     '17830.88470000',
        //     44,
        //     '32.67600000',
        //     '9701.70850000',
        //     '0'
        //   ]

        // array of array, map each item to object
        let dataArray = []
        data.forEach((e) => {
            let k = new BinanceCandlestick(
                symbol,
                '1m',
                e[0],
                e[1],
                e[2],
                e[3],
                e[4],
                e[5]
            )
            dataArray.push(k)
        })
        try {
            db.binance_klines.bulkCreate(dataArray)
            dataArray = []
        } catch (error) {
            console.log('Error inserting data', error)
        }
    }
}
