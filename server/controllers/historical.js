const express = require('express')
const router = express.Router()
const { getHistoricalModel } = require('../models/tda_getHistorical')
const fetch = require('node-fetch')

// load the module and display its version
const talib = require('talib')

router.get(['/:id'], async (request, response) => {
    try {
        const url = getHistoricalModel(request.params.id, request.query)
        console.log(url)

        console.log('TALib Version: ' + talib.version)
        const functions = talib.functions
        for (i in functions) {
            let name = functions[i].name
            if (name.includes('VWAP')) {
                console.log(functions[i])
            }
        }
        // let optionalQuery2 = {
        //     frequencyType: 'daily',
        //     endDate: new Date(2020, 0, 1, 0, 0).getTime(),
        //     startDate: new Date(2010, 0, 1, 0, 0).getTime(),
        //     periodType: 'year',
        //     needExtendedHoursData: false
        // }

        const tda_response = await fetch(url)
        const data = await tda_response.json()
        let marketData = {}
        data.candles.forEach((obj) => {
            Object.keys(obj).forEach((key) => {
                marketData[key] = (marketData[key] || []).concat([obj[key]])
            })
        })

        let adxOptions = {
            name: 'ADX',
            startIdx: 0,
            endIdx: marketData.close.length - 1,
            high: marketData.high,
            low: marketData.low,
            close: marketData.close,
            optInTimePeriod: 9
        }

        // execute Average Directional Movement Index indicator with time period 9
        let adx = talib.execute(adxOptions, (err, result) => {
            return result
        })
        let adx2 = talib.execute(adxOptions)
        //var open = data.candles.map((el) => el.open)
        response.send(adx2)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router
