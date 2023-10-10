const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const { spawn } = require('child_process');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
    console.error(`Node cluster master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.error(
            `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
        );
    });
} else {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(bodyParser.json());

    // Get requests
    app.get('/api', function (req, res) {
        res.set('Content-Type', 'application/json');
        res.send('{"message":"Hello from the custom server!"}');
    });

    app.get('/api/stock-data/:symbol', async (req, res) => {
        const { symbol } = req.params;

        try {
            const response = await axios.get(
                `https://query1.finance.yahoo.com/v7/finance/download/${symbol}`
            );

            const raw_data = response.data.split(',');

            // Convert date to Unix timestamp
            const dateParts = raw_data[6].split('\n')[1].split('-');
            const year = parseInt(dateParts[0]);
            const month = parseInt(dateParts[1]) - 1; // Months are 0-indexed
            const day = parseInt(dateParts[2]);
            const date = new Date(year, month, day);
            const unixTimestamp = Math.floor(date.getTime() / 1000);

            const stockData = {
                symbol: symbol,
                date: unixTimestamp,
                open: parseFloat(raw_data[7]),
                high: parseFloat(raw_data[8]),
                low: parseFloat(raw_data[9]),
                close: parseFloat(raw_data[10]),
                adjClose: parseFloat(raw_data[11]),
                volume: parseFloat(raw_data[12])
            };

            res.set('Content-Type', 'application/json');
            res.json(stockData);
        } catch (error) {
            console.error('Error fetching stock data:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    });

    app.get('/api/stock-tickers', async (req, res) => {
        const group = (tickerSymbols) => {
            const groupedSymbols = {};

            tickerSymbols.forEach((ticker) => {
                const firstLetter = ticker.symbol.charAt(0).toLowerCase();
                if (!groupedSymbols[firstLetter]) {
                    groupedSymbols[firstLetter] = [];
                }
                groupedSymbols[firstLetter].push(ticker);
            });

            return groupedSymbols;
        };

        try {
            const url =
                'https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&download=true';
            const response = await axios.get(url);
            const result = response.data;
            const tickerSymbols = result.data.rows
                .flatMap((ticker) => {
                    if (String(ticker.country).startsWith('United States')) {
                        return {
                            symbol: String(ticker.symbol).replace('^', '-P'),
                            company_name: ticker.name
                                .replace(
                                    /(Inc\.|Inc|Incorporated|Corporation|Corp|Bancorp|Company|Trust(?![A-Za-z0-9])|Ltd\.|ltd|Limited|Co\.).*/,
                                    '$1'
                                )
                                .replace(/Common.*|Ordinary.*/, '')
                                .trim(),
                            netchange: parseFloat(ticker.netchange),
                            pctchange: ticker.pctchange
                        };
                    }
                    return null;
                })
                .filter(Boolean);

            res.set('Content-Type', 'application/json');
            res.json(group(tickerSymbols));
        } catch (error) {
            console.log('Error fetching stock tickers: ', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    });

    app.get('/api/time-series-stock-data/:symbol', async (req, res) => {
        const { symbol } = req.params;
        const { interval, range } = req.query;

        try {
            const response = await axios.get(
                `https://query1.finance.yahoo.com/v7/finance/chart/${symbol}`,
                {
                    params: {
                        interval,
                        range,
                        includeAdjustedClose: true
                    }
                }
            );

            const result = response.data.chart.result[0];

            const stockData = result.timestamp.map((timestamp, index) => {
                const jsonData = result.indicators.quote[0];

                return {
                    symbol: symbol,
                    date: timestamp + result.meta.gmtoffset,
                    open: parseFloat(jsonData.open[index]) ?? 0,
                    high: parseFloat(jsonData.high[index]) ?? 0,
                    low: parseFloat(jsonData.low[index]) ?? 0,
                    close: parseFloat(jsonData.close[index]) ?? 0,
                    // adjClose: result.indicators.adjclose[0].adjclose[index],
                    adjClose: parseFloat(jsonData.close[index]) ?? 0,
                    volume: parseFloat(jsonData.volume[index]) ?? 0
                };
            });

            res.set('Content-Type', 'application/json');
            res.json(stockData);
        } catch (error) {
            console.error('Error fetching stock data:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    });

    app.get('/api/stock-ticker-stats/:symbol', async (req, res) => {
        const { symbol } = req.params;
        const url = `https://query1.finance.yahoo.com/v7/finance/options/${symbol}`;

        try {
            const response = await axios.get(url);
            const result = response.data.optionChain.result[0].quote;

            const statsData = {
                companyName: result.longName,
                quoteType: result.quoteType,
                marketChangePct:
                    parseFloat(result.regularMarketChangePercent).toFixed(2) +
                    '%',
                marketChange: parseFloat(result.regularMarketChange),
                marketPrice: parseFloat(result.regularMarketPrice),
                analystRating: result.averageAnalystRating,
                marketState: result.marketState,
                marketDayHigh: parseFloat(result.regularMarketDayHigh),
                marketDayLow: parseFloat(result.regularMarketDayLow),
                marketDayVolume: parseFloat(result.regularMarketDayVolume),
                marketPrevClose: parseFloat(result.regularMarketPreviousClose),
                bid: parseFloat(result.bid),
                ask: parseFloat(result.ask),
                marketCap: parseFloat(result.marketCap),
                peRatio: parseFloat(result.priceEpsCurrentYear),
                dividendRate: parseFloat(result.trailingAnnualDividendRate),
                dividendYield: parseFloat(result.trailingAnnualDividendYield),
                totalShares: parseFloat(result.sharesOutstanding),
                fiftyTwoWeekLow: parseFloat(result.fiftyTwoWeekLow),
                fiftyTwoWeekHigh: parseFloat(result.fiftyTwoWeekHigh),
                closingTime:
                    parseInt(result.regularMarketTime) +
                    parseInt(result.gmtOffSetMilliseconds) / 1000
            };

            res.set('Content-Type', 'application/json');
            res.json(statsData);
        } catch (error) {
            console.error('Error fetching stock ticker stats:', error);
            res.status(500).json({ error: 'An error occured' });
        }
    });

    // N-BEATS-RevIN-Model
    app.post('/api/model', async (req, res) => {
        const historicalData = req.body.historicalData;
        const forecastData = [];
        try {
            const response = await axios.post('http://127.0.0.1:7000/api/model', {historicalData: historicalData});
            console.log(response.data.forecastData)
            res.json(response.data.forecastData);
            forecastData.push(response.data.forecastData);
        } catch (error) {
            console.error('Error predicting with the model:', error.response ? error.response.data : error.message);
            res.status(500).json({ error: 'An error occurred' });
        }
    });

    app.listen(PORT, function () {
        console.error(
            `Node ${
                isDev ? 'dev server' : 'cluster worker ' + process.pid
            }: listening on port ${PORT}`
        );
    });
}
