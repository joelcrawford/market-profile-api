/**
 * GET /resources/summarize
 * Search for a term in the library
 * Query Params -
 * agg_field:
 * page_size:
 * sort:
 */

const express = require('express')
const { selectStats } = require('../queries/selectStats')
const { binance } = require('../statics')

const router = express.Router()

router.get(['/'], async (request, response) => {
    try {
        console.log(request.query, request.params)

        // check the params and query -----------

        // go get the stats ------------------
        const stats = await selectStats(request.params, request.query)
        // backfill each instrument --------------------------
        if (stats) {
            data.forEach((i) => {
                let startDate = i.dataValues.latest.valueOf()
                console.log(
                    `${i.dataValues.symbol}: ${new Date(startDate).toString(
                        'YYYY-MM-DD'
                    )}`
                )
                backfill(
                    'binance',
                    binance.spot.endpoint,
                    i.dataValues.symbol,
                    '1m',
                    startDate,
                    binance.rateLimits.max
                )
            })
        }
        // check to see if there is a result sent back from insert in postgres
        return response.send('Done')
    } catch (error) {
        return response.send(error)
    }
})

module.exports = router
