require('dotenv').config()

const { Sequelize } = require('sequelize')
const BinanceKlines = require('./models/binance_klines')
//const SecondModel = require('./second-model')

const dbOptions = {
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_USER_PASSWORD,
    host: process.env.POSTGRES_HOST
}

const sequelize = new Sequelize(
    `postgres://${dbOptions.user}:${dbOptions.password}@${dbOptions.host}:${dbOptions.port}/node_test`,
    {
        //logging: (...msg) => console.log(msg),
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
)

const models = {
    binance_klines: BinanceKlines.init(sequelize)
    //Second: SecondModel.init(sequelize, Sequelize)
}

// Run `.associate` if it exists,
// ie create relationships in the ORM
Object.values(models)
    .filter((model) => typeof model.associate === 'function')
    .forEach((model) => model.associate(models))

const db = {
    ...models,
    sequelize
}

module.exports = db
