require('dotenv').config()
const server = require('./server')
const port = process.env.PORT || 5000

server
    .listen(port, () => {
        console.log(
            `Listening with eager anticipation on port ${port} in ${process.env.NODE_ENV} environment...`
        )
    })
    .on('error', (error) => {
        console.log(
            error,
            'Logging error to console. This is a nodemon error that recently started when I accidentally used yarn'
        )
    })

// const moment = require('moment')
// const { backfill } = require('./server/tools/backfill')
// const { binance } = require('./server/statics')
// binance.coinPairs.forEach((c) => {
//     let startDate = moment().subtract(3, 'days').valueOf()
//     console.log(`${c}: ${new Date(startDate).toString('YYYY-MM-DD')}`)
//     backfill(
//         'binance',
//         binance.spot.endpoint,
//         c,
//         '1m',
//         startDate,
//         binance.rateLimits.max
//     )
// })
