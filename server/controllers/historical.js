const express = require('express')
const router = express.Router()
const { getHistoricalData } = require('../models/getHistoricalData')

router.get(['/'], async (request, response) => {
    const data = await getHistoricalData(request.query)
    console.log(data)
})

module.exports = router
