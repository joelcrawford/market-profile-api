const { selectStats } = require('../queries/selectStats')
const { backfill } = require('../tools/backfill')
const { binance } = require('../statics')

module.exports = {
    async tempCronBackfill(x) {
        let params = {
            x
        }
        let query = {}
        const stats = await selectStats(params, query)
        //console.log(stats)
        let resultsArray = []
        // backfill each instrument --------------------------
        if (stats) {
            stats.forEach((i) => {
                let startDate = i.dataValues.latest.valueOf() + 60000
                resultsArray.push(
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
    },
    backfillSymbol(symbol, date) {
        console.log(
            'backfillsymbol',
            `${symbol}: ${new Date(date).toString('YYYY-MM-DD')}`
        )
        backfill(
            'binance',
            binance.spot.endpoint,
            symbol,
            '1m',
            date,
            binance.rateLimits.max
        )
    }
}
