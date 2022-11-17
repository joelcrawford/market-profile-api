//const symbol = ['GOOGL'] //for multiple symbols: ['GOOGL', 'AAPL']

require('dotenv').config()
const server = require('./server')
const port = process.env.PORT || 6000

server
    .listen(port, () => {
        console.log(
            `Listening on port ${port} in ${process.env.NODE_ENV} environment...`
        )
    })
    .on('error', (error) => {
        console.log(
            error,
            'Logging error to console. This is a nodemon error that recently started when I accidentally used yarn'
        )
    })
