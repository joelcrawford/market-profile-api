const data = JSON.parse(msg)
if (data.e === 'kline' && data.s === 'BTCUSDT') {
    const c = data.k
    let k = new BinanceCandlestick(c.s, c.i, c.t, c.o, c.h, c.l, c.c, c.v)
}
