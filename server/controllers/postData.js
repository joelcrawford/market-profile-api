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

        // we need COINPAIR, for each coinpair
        // get latest, if nothing go back 7 days
        // binance.coinPairs.forEach((c) => {
        //     let startDate = moment().subtract(1, 'days').valueOf()
        //     console.log(`${c}: ${new Date(startDate).toString('YYYY-MM-DD')}`)
        //     backfill(
        //         'Binance',
        //         binance.spot.endpoint,
        //         c,
        //         '1m',
        //         startDate,
        //         rateLimits.max
        //     )
        // })
    } catch (error) {
        return response.send(error)
    }
})

module.exports = router
