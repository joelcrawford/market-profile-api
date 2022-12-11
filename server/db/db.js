require('dotenv').config()

const { Sequelize } = require('sequelize')
const BinanceKlines = require('./models/binance_klines')
//const iqFeedHistorical = require('./iq_feed_historical')

const currentDatabase = 'node_test'

const pgOptions = {
    //logging: (...msg) => console.log(msg),
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_USER_PASSWORD,
    host: process.env.POSTGRES_HOST,
    database: currentDatabase,
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
}

const sequelize = new Sequelize(pgOptions)

const models = {
    binance_klines: BinanceKlines.init(sequelize)
    //iq_feed_historical: iqFeedHistorical.init(sequelize)
}

// Run `.associate` if it exists,
// ie create relationships in the ORM
// Object.values(models)
//     .filter((model) => typeof model.associate === 'function')
//     .forEach((model) => model.associate(models))

const db = {
    ...models,
    sequelize
}

module.exports = db
