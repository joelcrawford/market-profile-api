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

// Stats - earliest, latest dates with record count
const getStats = require('./controllers/getStats')
// Duplicates - you can view count or just delete them all ?action=view,delete
const getDupes = require('./controllers/getDupes') // Duplicates
// Backfill - backfill data from latest date
const postData = require('./controllers/postData')

server.use('/stats', getStats)
server.use('/dupes', getDupes)
server.use('/backfill', postData)

module.exports = server
