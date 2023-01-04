const express = require('express')
const cors = require('cors')
//const path = require('path')
//const bodyParser = require('body-parser')

// Another way to do this is to create own server
// var http = require('http');
// var app = express();
// var server = http.createServer(app);
// then you can catch errors as needed
// server.on('error', function (e) {
//     // do your thing
//   });
// and listen
//server.listen(3000);

// Initialize...
const server = express()

// CORS
server.use(cors())
// json is default format return type
server.use(express.json())

// auto encode URL params
server.use(
    express.urlencoded({
        extended: true
    })
)

const getStats = require('./controllers/getStats') // SUMMARIZE
const getDupes = require('./controllers/getDupes')

server.use('/stats', getStats)
server.use('/dupes', getDupes)

module.exports = server
