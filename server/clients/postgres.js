require('dotenv').config()
const Sequelize = require('sequelize')
const pgPort = process.env.POSTGRES_PORT || 5432
const pgUser = process.env.POSTGRES_USER
const pgUserPassword = process.env.POSTGRES_USER_PASSWORD
const pgHost = process.env.POSTGRES_HOST

module.exports = new Sequelize(
    `postgres://${pgUser}:${pgUserPassword}@${pgHost}:${pgPort}/postgres`,
    {
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
