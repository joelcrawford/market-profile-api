## MARKET DATA FIREHOSE STREAM FOR UR MARKET PROFILE SORCERY

Simple ETL application, sends stream to postgres db for aggregation

### Task List

-   [x] Websocket connection to market data
-   [x] Connect to database
-   [x] Create candlestick model for 1m klines
-   [] Continuous Aggregation with TimescaleDb
-   [] Deploy

### Extras

-   [] Backfill function for missing data

### Next up (separate apps)

-   [] Express API for time based queries (timescaleDb)
-   [] Analysis, possibly python app to run calcs daily
