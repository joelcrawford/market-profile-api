require('dotenv').config() // load .env into process environment
//require('isomorphic-fetch')
const { baseUrl } = require('../statics').tda
const apikey = process.env.TDA_API_KEY
// API docs:
// https://developer.tdameritrade.com/price-history/apis/get/marketdata/%7Bsymbol%7D/pricehistory#
// https://api.tdameritrade.com/v1/marketdata/{SPX}/pricehistory
// ?apikey=OSJBFRIASHXURBZJS4T2MUMQSK0XSN1N&periodType=day&period=2&frequencyType=minute&frequency=1
module.exports = {
    getHistoricalModel(symbol, optionalQuery = {}) {
        const historicalPricesExtension = `marketdata/${symbol}/pricehistory`

        const queryParams = {
            apikey,
            ...optionalQuery
        }

        const historicalPricesUrl = `${baseUrl}/${historicalPricesExtension}?${new URLSearchParams(
            queryParams
        ).toString()}`

        return historicalPricesUrl
    }
}
