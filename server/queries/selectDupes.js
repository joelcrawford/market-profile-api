const db = require('../db/db')

module.exports = {
    async selectDupes(params, _) {
        const dupes = await db.sequelize.query(
            `select * from (
                SELECT id,
                exchange, symbol, time,
                ROW_NUMBER() OVER(PARTITION BY exchange, symbol, time ORDER BY exchange, symbol, time asc) AS Row
                FROM binance_klines
                WHERE exchange = '${params.x}'
            ) dups
            where dups.Row > 1`
        )
        return dupes[0]
    },
    async deleteDupes(params, _) {
        const deletedDupes = await db.sequelize.query(
            `DELETE FROM binance_klines
            WHERE id IN (
            select id from (
                SELECT id,
                exchange, symbol, time,
                ROW_NUMBER() OVER(PARTITION BY exchange, symbol, time ORDER BY exchange, symbol, time asc) AS Row
                FROM binance_klines
                WHERE exchange = '${params.x}'
            ) dups
            where dups.Row > 1);`
        )
        //console.log(deletedDupes)
        return deletedDupes
    }
}
