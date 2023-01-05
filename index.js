require('dotenv').config()
const cron = require('node-cron')
const server = require('./server')
const port = process.env.PORT || 5000
const { tempCronBackfill } = require('./server/tools/tempCronBackfill')

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

cron.schedule('*/30 * * * *', () => {
    console.log('running every 2nd minute')
    tempCronBackfill('binance')
})

//tempCronBackfill('binance')
