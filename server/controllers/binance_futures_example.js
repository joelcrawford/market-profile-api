const WebSocket = require('ws')
const ccxt = require('ccxt')
const moment = require('moment')
const _ = require('lodash')
const querystring = require('querystring')
const request = require('request')
const Candlestick = require('../dict/candlestick')
const Ticker = require('../dict/ticker')
const Order = require('../dict/order')
const TickerEvent = require('../event/ticker_event')
const ExchangeCandlestick = require('../dict/exchange_candlestick')
const Position = require('../dict/position')
const CcxtExchangeOrder = require('./ccxt/ccxt_exchange_order')

module.exports = class BinanceFutures {
    constructor(
        eventEmitter,
        requestClient,
        candlestickResample,
        logger,
        queue,
        candleImporter,
        throttler
    ) {
        this.eventEmitter = eventEmitter
        this.logger = logger
        this.queue = queue
        this.candleImporter = candleImporter
        this.throttler = throttler
        this.exchange = null

        this.ccxtExchangeOrder = CcxtExchangeOrder.createEmpty(logger)

        this.positions = {}
        this.orders = {}
        this.tickers = {}
        this.symbols = []
        this.intervals = []
        this.ccxtClient = undefined
        this.map = {
            s: 'symbol',
            c: 'clientOrderId',
            S: 'side',
            o: 'type',
            f: 'timeInForce',
            q: 'origQty',
            p: 'price',
            sp: 'stopPrice',
            X: 'status',
            i: 'orderId',
            T: 'updateTime',
            z: 'executedQty'
            // n: 'cumQuote' // not fully sure about commision
        }
    }

    backfill(symbol, period, start) {
        const symbolUpdated = symbol.replace('PERP', '')

        return new Promise((resolve, reject) => {
            const query = querystring.stringify({
                interval: period,
                symbol: symbolUpdated,
                limit: 500,
                startTime: moment(start).valueOf()
            })

            request(
                `${this.getBaseUrl()}/fapi/v1/klines?${query}`,
                { json: true },
                (err, res, body) => {
                    if (err) {
                        console.log(
                            `Binance: Candle backfill error: ${String(err)}`
                        )
                        reject()
                        return
                    }

                    if (res.statusCode === 429) {
                        console.log(
                            `Binance: Limit reached: ${String(res.headers)}`
                        )
                        // TODO delay next execution
                        reject()
                        return
                    }

                    if (!Array.isArray(body)) {
                        console.log(
                            `Binance: Candle backfill error: ${JSON.stringify(
                                body
                            )}`
                        )
                        reject()
                        return
                    }

                    resolve(
                        body.map((candle) => {
                            return new Candlestick(
                                moment(candle[0]).format('X'),
                                candle[1],
                                candle[2],
                                candle[3],
                                candle[4],
                                candle[5]
                            )
                        })
                    )
                }
            )
        })
    }

    start(config, symbols) {
        const { logger } = this
        this.exchange = null

        const ccxtClient = (this.ccxtClient = new ccxt.binance({
            apiKey: config.key,
            secret: config.secret,
            options: {
                defaultType: 'future',
                warnOnFetchOpenOrdersWithoutSymbol: false
            }
        }))

        this.intervals = []

        this.symbols = symbols
        this.positions = {}
        this.orders = {}
        this.ccxtExchangeOrder = BinanceFutures.createCustomCcxtOrderInstance(
            ccxtClient,
            symbols,
            logger
        )

        const me = this

        if (
            config.key &&
            config.secret &&
            config.key.length > 0 &&
            config.secret.length > 0
        ) {
            setInterval(async () => {
                me.throttler.addTask(
                    'binance_futures_sync_orders',
                    async () => {
                        await me.ccxtExchangeOrder.syncOrders()
                    }
                )
            }, 1000 * 30)

            setInterval(async () => {
                me.throttler.addTask(
                    'binance_futures_sync_positions',
                    me.syncPositionViaRestApi.bind(me)
                )
            }, 1000 * 36)

            setTimeout(async () => {
                await ccxtClient.fetchMarkets()
                me.throttler.addTask(
                    'binance_futures_sync_orders',
                    async () => {
                        await me.ccxtExchangeOrder.syncOrders()
                    }
                )
                me.throttler.addTask(
                    'binance_futures_sync_positions',
                    me.syncPositionViaRestApi.bind(me)
                )
            }, 1000)

            setTimeout(async () => {
                await me.initUserWebsocket()
            }, 2000)

            setTimeout(async () => {
                await me.initPublicWebsocket(symbols)
            }, 5000)
        } else {
            me.logger.info(
                'Binance Futures: Starting as anonymous; no trading possible'
            )
        }

        symbols.forEach((symbol) => {
            symbol.periods.forEach((period) => {
                // for bot init prefill data: load latest candles from api
                this.queue.add(async () => {
                    let ohlcvs

                    try {
                        ohlcvs = await ccxtClient.fetchOHLCV(
                            symbol.symbol.replace('USDT', '/USDT'),
                            period,
                            undefined,
                            500
                        )
                    } catch (e) {
                        me.logger.info(
                            `Binance Futures: candles fetch error: ${JSON.stringify(
                                [symbol.symbol, period, String(e)]
                            )}`
                        )

                        return
                    }

                    const ourCandles = ohlcvs.map((candle) => {
                        return new ExchangeCandlestick(
                            me.getName(),
                            symbol.symbol,
                            period,
                            Math.round(candle[0] / 1000),
                            candle[1],
                            candle[2],
                            candle[3],
                            candle[4],
                            candle[5]
                        )
                    })

                    await me.candleImporter.insertThrottledCandles(ourCandles)
                })
            })
        })
    }

    calculatePrice(price, symbol) {
        return price // done by ccxt
    }

    calculateAmount(amount, symbol) {
        return amount // done by ccxt
    }

    getName() {
        return 'binance_futures'
    }

    isInverseSymbol(symbol) {
        return false
    }

    async initPublicWebsocket(symbols) {
        const me = this

        const allSubscriptions = []
        symbols.forEach((symbol) => {
            allSubscriptions.push(`${symbol.symbol.toLowerCase()}@bookTicker`)
            allSubscriptions.push(
                ...symbol.periods.map(
                    (p) => `${symbol.symbol.toLowerCase()}@kline_${p}`
                )
            )
        })

        me.logger.info(
            `Binance Futures: Public stream subscriptions: ${allSubscriptions.length}`
        )

        // "A single connection can listen to a maximum of 200 streams."; let us have some window frames
        _.chunk(allSubscriptions, 180).forEach(
            (allSubscriptionsChunk, indexConnection) => {
                me.initPublicWebsocketChunk(
                    allSubscriptionsChunk,
                    indexConnection
                )
            }
        )
    }

    /**
     * A per websocket init function scope to filter maximum allowed subscriptions per connection
     *
     * @param {string[]} subscriptions
     * @param {int} indexConnection
     */
    initPublicWebsocketChunk(subscriptions, indexConnection) {
        const me = this
        const ws = new WebSocket('wss://fstream.binance.com/stream')

        ws.onerror = function (event) {
            me.logger.error(
                `Binance Futures: Public stream (${indexConnection}) error: ${JSON.stringify(
                    [event.code, event.message]
                )}`
            )
        }

        let subscriptionTimeouts = {}

        ws.onopen = function () {
            me.logger.info(
                `Binance Futures: Public stream (${indexConnection}) opened.`
            )

            me.logger.info(
                `Binance Futures: Needed Websocket (${indexConnection}) subscriptions: ${JSON.stringify(
                    subscriptions.length
                )}`
            )

            // "we are only allowed to send 5 requests per second"; but limit it also for the "SUBSCRIBE" itself who knows upcoming changes on this
            _.chunk(subscriptions, 15).forEach((subscriptionChunk, index) => {
                subscriptionTimeouts[index] = setTimeout(() => {
                    me.logger.debug(
                        `Binance Futures: Public stream (${indexConnection}) subscribing: ${JSON.stringify(
                            subscriptionChunk
                        )}`
                    )

                    ws.send(
                        JSON.stringify({
                            method: 'SUBSCRIBE',
                            params: subscriptionChunk,
                            id: Math.floor(Math.random() * Math.floor(100))
                        })
                    )

                    delete subscriptionTimeouts[index]
                }, (index + 1) * 1500)
            })
        }

        ws.onmessage = async function (event) {
            if (event.type && event.type === 'message') {
                const body = JSON.parse(event.data)

                if (
                    body.stream &&
                    body.stream.toLowerCase().includes('@bookticker')
                ) {
                    me.eventEmitter.emit(
                        'ticker',
                        new TickerEvent(
                            me.getName(),
                            body.data.s,
                            (me.tickers[body.data.s] = new Ticker(
                                me.getName(),
                                body.data.s,
                                moment().format('X'),
                                parseFloat(body.data.b),
                                parseFloat(body.data.a)
                            ))
                        )
                    )
                } else if (
                    body.stream &&
                    body.stream.toLowerCase().includes('@kline')
                ) {
                    await me.candleImporter.insertThrottledCandles([
                        new ExchangeCandlestick(
                            me.getName(),
                            body.data.s,
                            body.data.k.i,
                            Math.round(body.data.k.t / 1000),
                            parseFloat(body.data.k.o),
                            parseFloat(body.data.k.h),
                            parseFloat(body.data.k.l),
                            parseFloat(body.data.k.c),
                            parseFloat(body.data.k.v)
                        )
                    ])
                }
            }
        }

        ws.onclose = function (event) {
            me.logger.error(
                `Binance Futures: Public Stream (${indexConnection}) connection closed: ${JSON.stringify(
                    [event.code, event.message]
                )}`
            )

            Object.values(subscriptionTimeouts).forEach((timeout) => {
                clearTimeout(timeout)
            })

            subscriptionTimeouts = {}

            setTimeout(async () => {
                me.logger.info(
                    `Binance Futures: Public stream (${indexConnection}) connection reconnect`
                )
                await me.initPublicWebsocketChunk(
                    subscriptions,
                    indexConnection
                )
            }, 1000 * 30)
        }
    }

    async initUserWebsocket() {
        let response
        try {
            response = await this.ccxtClient.fapiPrivatePostListenKey()
        } catch (e) {
            this.logger.error(`Binance Futures: listenKey error: ${String(e)}`)
            return undefined
        }

        if (!response || !response.listenKey) {
            this.logger.error(
                `Binance Futures: invalid listenKey response: ${JSON.stringify(
                    response
                )}`
            )
            return undefined
        }

        const me = this
        const ws = new WebSocket(
            `wss://fstream.binance.com/ws/${response.listenKey}`
        )
        ws.onerror = function (e) {
            me.logger.info(`Binance Futures: Connection error: ${String(e)}`)
        }

        ws.onopen = function () {
            me.logger.info(`Binance Futures: Opened user stream`)
        }

        ws.onmessage = async function (event) {
            if (event && event.type === 'message') {
                const message = JSON.parse(event.data)

                if (
                    message.e &&
                    message.e.toUpperCase() === 'ORDER_TRADE_UPDATE'
                ) {
                    const order = BinanceFutures.createRestOrderFromWebsocket(
                        message.o
                    )

                    me.logger.info(
                        `Binance Futures: ORDER_TRADE_UPDATE event: ${JSON.stringify(
                            [message.e, message.o, order]
                        )}`
                    )
                    me.throttler.addTask(
                        'binance_futures_sync_orders',
                        async () => {
                            await me.ccxtExchangeOrder.syncOrders()
                        },
                        3000
                    )
                    me.ccxtExchangeOrder.triggerPlainOrder(order)
                }

                if (message.e && message.e.toUpperCase() === 'ACCOUNT_UPDATE') {
                    me.accountUpdate(message)

                    me.throttler.addTask(
                        'binance_futures_sync_positions',
                        me.syncPositionViaRestApi.bind(me),
                        3000
                    )
                }
            }
        }

        const heartbeat = setInterval(async () => {
            try {
                await this.ccxtClient.fapiPrivatePutListenKey()
                this.logger.debug(
                    'Binance Futures: user stream ping successfully done'
                )
            } catch (e) {
                this.logger.error(
                    `Binance Futures: user stream ping error: ${String(e)}`
                )
            }
        }, 1000 * 60 * 10)

        ws.onclose = function (event) {
            me.logger.error(
                `Binance futures: User stream connection closed: ${JSON.stringify(
                    [event.code, event.message]
                )}`
            )
            clearInterval(heartbeat)

            setTimeout(async () => {
                me.logger.info(
                    'Binance futures: User stream connection reconnect'
                )
                await me.initUserWebsocket()
            }, 1000 * 30)
        }

        return true
    }

    getBaseUrl() {
        return 'https://fapi.binance.com/'
    }
}
