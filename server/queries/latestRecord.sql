SELECT min(time) as first_time, max(time) as latest_time FROM binance_klines
WHERE exchange == X and symbol == Y;