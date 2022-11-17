const express = require('express')
const router = express.Router()
const { getHistoricalData } = require('../models/getHistoricalData')

router.get(['/'], async (request, response) => {
    console.log('hi!')
    const h = await getHistoricalData('GOOGL')
    console.log(h)
})

module.exports = router
