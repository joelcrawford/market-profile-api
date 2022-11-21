const express = require('express')
const router = express.Router()
//const fetch = require('node-fetch')

router.get(['/:id'], async (request, response) => {
    try {
        console.log('params', request.params)
        console.log('query', request.query)

        response.send('Connected to ', request.params)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router
