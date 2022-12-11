# binance klines ---------------
npx sequelize model:generate --name binance_klines --attributes id:uuid,exchange:string,symbol:string,period:string,time:date,open:float,close:float,low:float,high:float,volume:float
