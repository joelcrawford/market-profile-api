const db = require('../db/db')

module.exports = {
    async selectDupes() {
        const dupes = await db.sequelize.query(
            `select * from (
                SELECT id,
                exchange, symbol, time,
                ROW_NUMBER() OVER(PARTITION BY exchange, symbol, time ORDER BY exchange, symbol, time asc) AS Row
                FROM binance_klines
            ) dups
            where dups.Row > 1`
        )
        //console.log(dupes)
        // let dupeArray = []
        // dupes[0].map((o) => {
        //     dupeArray.push(o.id)
        // })

        return dupes[0]
    }
}
