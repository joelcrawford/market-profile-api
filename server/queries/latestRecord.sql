SELECT max(time) as latest FROM binance_klines WHERE exchange == X and symbol == Y;

SELECT exchange, symbol, count(*), min(time) as earliest, max(time) as latest 
FROM binance_klines GROUP BY exchange, symbol;