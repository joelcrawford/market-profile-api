module.exports = {
    apps: [
        {
            name: 'API',
            script: 'dist/index.js',
            autorestart: true,
            watch: true,
            max_memory_restart: '300M',
            env: {
                NODE_ENV: 'production',
                TDA_API_KEY: 'OSJBFRIASHXURBZJS4T2MUMQSK0XSN1N',
                BINANCE_KEY:
                    'KIQygS5fxZ5bYUOmWaQwd9NLArCQ2OgTZ459hFJeYwwqbYHXFvLjPBX80XFEPBCx',
                BINANCE_SECRET:
                    'lWAc8e82XRCWIijVoEOmolgJ4KSeYOF9TLNR3wtsNEzkTXePjWhrSQvG9n6UhXeT',
                PORT: 5000,
                POSTGRES_USER_PASSWORD: 'Arpples13!',
                HHY_HOST: '127.0.0.1',
                POSTGRES_PORT: 5432,
                POSTGRES_USER: 'joel'
            }
        }
    ]
}
