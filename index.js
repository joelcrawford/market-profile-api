require('dotenv').config()
const path = require('path')
const cron = require('node-cron')
const server = require('./server')
const port = process.env.PORT || 5000
const { tempCronBackfill } = require('./server/tools/tempCronBackfill')
const { options } = require('./server/statics')

const { authorize } = require('./server/google/authorize')
const { listMajors } = require('./server/google/test_list_majors')

server
    .listen(port, () => {
        console.log(
            `Listening with eager anticipation on port ${port} in ${
                process.env.NODE_ENV
            } environment...\n ${new Date().toLocaleString('en-CA')}`
        )
    })
    .on('error', (error) => {
        console.log(
            error,
            'Logging error to console. This is a nodemon error that recently started when I accidentally used yarn'
        )
    })

if (process.env.NODE_ENV === 'production') {
    cron.schedule(options.cron.every_hour_at_30_mins, () => {
        tempCronBackfill('binance').then(
            console.log(
                `CRON: every hour/30th min: ${new Date().toLocaleString(
                    'en-CA'
                )}`
            )
        )
    })
}

authorize().then(listMajors).catch(console.error)
