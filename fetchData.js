require('isomorphic-fetch')
require('dotenv').config() // load .env into process environment

const baseUrl = `https://api.tdameritrade.com/v1/marketdata`
const apikey = process.env.API_SECRET_KEY
const quotesExtension = 'pricehistory'
//const symbol = ['GOOGL'] //for multiple symbols: ['GOOGL', 'AAPL']
const queryParams = {
    apikey: apikey,
    periodType: 'day',
    period: 2,
    frequencyType: 'minute',
    frequency: 1
}

const queryParamsHistory = {
    apikey,
    frequencyType: 'daily',
    endDate: new Date(2020, 0, 1, 0, 0).getTime(), // endDate in msec since epoch
    startDate: new Date(2010, 0, 1, 0, 0).getTime(), // startDate in msec since epoch
    periodType: 'year'
}

const quotesUrl = `${baseUrl}/QQQ/${quotesExtension}?${new URLSearchParams(
    queryParams
).toString()}`

console.log(quotesUrl)
//const inst = 'QQQ'
//const baseUrl = `https://api.tdameritrade.com/v1/marketdata/${inst}/pricehistory`

// /v1/marketdata/QQQ/pricehistory?apikey=OSJBFRIASHXURBZJS4T2MUMQSK0XSN1N&periodType=day&period=2&frequencyType=minute&frequency=1

fetch(historicalPricesURL)
    .then((res) => res.json())
    .then(
        (
            data // note: the returned datetime property is formatted in ms since epoch
        ) =>
            data.candles.map((candle) => ({
                ...candle,
                datetime: new Date(candle.datetime)
            })) // converts datetime value to Date object
    )
    .catch((e) => console.log('error fetching data', e))
