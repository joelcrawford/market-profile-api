/**
 * GET /resources/summarize
 * Search for a term in the library
 * Query Params -
 * agg_field:
 * page_size:
 * sort:
 */

const express = require('express')
const moment = require('moment')
const { selectStats } = require('../queries/selectStats')
const { backfill } = require('../tools/backfill')
const { backfillSymbol } = require('../tools/tempCronBackfill')
const { binance, functions } = require('../statics')

const router = express.Router()

// NEED TO GET MORE SOPHISTICATED WITH INSERT
// query for records inserted and return a response from action
// await Promise.all(
//     stats.map(async (i) => {
//         const contents = await backfill(
//             'binance',
//             binance.spot.endpoint,
//             i.dataValues.symbol,
//             '1m',
//             startDate,
//             binance.rateLimits.max
//         )
//         console.log(contents)
//     })
// )

router.get(['/:x'], async (request, response) => {
    try {
        console.log(request.query, request.params)

        // check the params and query -----------

        // go get the stats ------------------
        const stats = await selectStats(request.params, request.query)
        console.log('post stats', stats)
        let resultsArray = []
        // backfill each instrument --------------------------
        if (stats.length > 0) {
            console.log('is there a stats?')
            stats.forEach((i) => {
                backfillSymbol(
                    i.dataValues.symbol,
                    i.dataValues.latest.valueOf()
                )
            })
        } else {
            // new instrument, not in db
            let instruments = []
            if (request.query.instruments) {
                // split at comma
                instruments = request.query.instruments.split(',')
            } else {
                response.send('instrument required')
            }
            console.log(instruments)
            instruments.forEach((i) => {
                backfillSymbol(
                    i,
                    moment()
                        .subtract(functions.backfill.mostDays, 'days')
                        .valueOf()
                )
            })
        }
        // check to see if there is a result sent back from insert in postgres
        return response.send(resultsArray)
    } catch (error) {
        return response.send(error)
    }
})

module.exports = router
