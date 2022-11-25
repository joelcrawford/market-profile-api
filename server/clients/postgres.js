require('dotenv').config()
//const { DatabaseError } = require('sequelize')
const Sequelize = require('sequelize')
const pgPort = process.env.POSTGRES_PORT || 5432
const pgUser = process.env.POSTGRES_USER
const pgUserPassword = process.env.POSTGRES_USER_PASSWORD
const pgHost = process.env.POSTGRES_HOST

// const sequelize = new Sequelize(
//     `postgres://${pgUser}:${pgUserPassword}@${pgHost}:${pgPort}/postgres`,
//     {
//         dialect: 'postgres',
//         protocol: 'postgres',
//         dialectOptions: {
//             ssl: {
//                 require: true,
//                 rejectUnauthorized: false
//             }
//         }
//     }
// )

// class Database {
//     static async setup() {
//         const credentials = await getCredentials()
//         this.sequelize = new Sequelize(credentials)
//         User.init(this.sequelize)
//         this.User = User
//         // When you have multiple models to associate add:
//         this.User.associate(this)
//     }
// }

class Database {
    static async setup() {
        const sequelize = new Sequelize(
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
        const db = await sequelize.authenticate()
        console.log('db', db)
    }
}

module.exports = Database
