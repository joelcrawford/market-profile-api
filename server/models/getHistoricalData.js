require('dotenv').config() // load .env into process environment
require('isomorphic-fetch')
const { baseUrl } = require('../statics').tda
const apikey = process.env.API_SECRET_KEY
// API docs:
// https://developer.tdameritrade.com/price-history/apis/get/marketdata/%7Bsymbol%7D/pricehistory#
// /v1/marketdata/QQQ/pricehistory?apikey=OSJBFRIASHXURBZJS4T2MUMQSK0XSN1N&periodType=day&period=2&frequencyType=minute&frequency=1
module.exports = {
    getHistoricalData(symbol, optionalQuery = {}) {
        const historicalPricesExtension = `marketdata/${symbol}/pricehistory`

        const queryParams = {
            apikey,
            ...optionalQuery
        }

        const historicalPricesURL = `${baseUrl}/${historicalPricesExtension}?${new URLSearchParams(
            queryParams
        ).toString()}`

        fetch(historicalPricesURL)
            .then((res) => res.json())
            .then((data) =>
                console.log(
                    data.candles.map((candle) => ({
                        ...candle,
                        datetime: new Date(candle.datetime)
                    }))
                )
            )
            .catch((e) => console.log('error fetching data', e))
    }
}
