require('dotenv').config()
const pg = require('pg')

// this is used for command line stuff, like npx sequelize (migrations, etc)
module.exports = {
    development: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_USER_PASSWORD,
        database: 'node_test',
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    },
    test: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_USER_PASSWORD,
        database: 'node_test',
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    },
    production: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_USER_PASSWORD,
        database: 'node_test',
        host: process.env.HHY_HOST,
        port: process.env.POSTGRES_PORT,
        logging: false,
        dialect: 'postgres',
        dialectModule: pg,
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
}
