require('dotenv').config()
const cron = require('node-cron')
const server = require('./server')
const port = process.env.PORT || 5000
const { tempCronBackfill } = require('./server/tools/tempCronBackfill')
const { options } = require('./server/statics')

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

if (process.env.NODE_ENV === 'production') {
    cron.schedule(options.cron.every_hour_at_45_mins, () => {
        tempCronBackfill('binance').then(
            console.log(
                `CRON 30th minute past every hour: ${new Date().toLocaleString(
                    'en-CA'
                )}`
            )
        )
    })
}
//tempCronBackfill('binance')
tempCronBackfill('binance').then(
    console.log(
        `CRON 30th minute past every hour: ${new Date().toLocaleString(
            'en-CA'
        )}`
    )
)
