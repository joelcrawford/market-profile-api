const express = require('express')
// Initialize...
const server = express()
server.use(express.json())

// auto encode URL params
server.use(
    express.urlencoded({
        extended: true
    })
)

const historical = require('./controllers/historical')

// Historical Price Data
server.use('/historical', historical)

module.exports = server
