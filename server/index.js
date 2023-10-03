const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

const { spawn } = require('child_process');

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
                    open: jsonData.open[index] ?? 0,
                    high: jsonData.high[index] ?? 0,
                    low: jsonData.low[index] ?? 0,
                    close: jsonData.close[index] ?? 0,
                    // adjClose: result.indicators.adjclose[0].adjclose[index],
                    adjClose: jsonData.close[index] ?? 0,
                    volume: jsonData.volume[index] ?? 0
                };
            });

            res.set('Content-Type', 'application/json');
            res.json(stockData);
        } catch (error) {
            console.error('Error fetching stock data:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    });

    app.get('/api/stock-ticker-stat/:symbol', async (req, res) => {
        const { symbol } = req.params;
        const url = `https://query1.finance.yahoo.com/v7/finance/options/${symbol}`;

        try {
            const response = await axios.get(url);
            const result = response.data.optionChain.result[0].quote;

            const statsData = {
                companyName: result.longName,
                quoteType: result.quoteType,
                marketChangePct: result.regularMarketChangePercent,
                marketPrice: result.regularMarketPrice,
                analystRating: result.averageAnalystRating,
                marketState: result.marketState,
                marketDayHigh: result.regularMarketDayHigh,
                marketDayLow: result.regularMarketDayLow,
                marketDayVolume: result.regularMarketDayVolume,
                marketPrevClose: result.regularMarketPreviousClose,
                bid: result.bid,
                ask: result.ask,
                marketCap: result.marketCap,
                peRatio: result.priceEpsCurrentYear,
                dividendRate: result.trailingAnnualDividendRate,
                dividendYield: result.trailingAnnualDividendYield,
                totalShares: result.sharesOutstanding,
                fiftyTwoWeekLow: result.fiftyTwoWeekLow,
                fiftyTwoWeekHigh: result.fiftyTwoWeekHigh,
                closingTime:
                    result.regularMarketTime + resultgmtOffSetMilliseconds
            };

            res.set('Content-Type', 'application/json');
            res.json(statsData);
        } catch {
            console.error('Error fetching stock ticker stats:', error);
            res.status(500).json({ error: 'An error occured' });
        }
    });

    // N-BEATS-RevIN-Model
    app.post('/api/model', (req, res) => {
        const historicalData = req.body.historicalData;
        const forecastData = [];

        const currentDir = path.dirname(__filename);
        console.log(path.dirname(__filename) + '\\nbeats_revin_model.py');

        // Run a Python command to get the Python interpreter path
        const python1 = spawn('python', [
            '-c',
            'import sys; print(sys.executable)'
        ]);

        let pythonInterpreterPath = '';

        python1.stdout.on('data', (data) => {
            pythonInterpreterPath += data.toString();
        });

        python1.on('close', (code) => {
            if (code === 0) {
                pythonInterpreterPath = pythonInterpreterPath.trim();
                console.log('Python Interpreter Path:', pythonInterpreterPath);
            } else {
                console.error(
                    `Failed to capture Python interpreter path. Exit code: ${code}`
                );
            }
        });

        const python = spawn('python', [
            currentDir + '\\nbeats_revin_model.py',
            JSON.stringify(historicalData)
        ]);

        python.stdout.on('data', (data) => {
            console.log('Pipe data from python script');
            forecastData.push(JSON.parse(data));
        });

        python.on('close', (code) => {
            console.log(`Child process close all stdio with code ${code}`);
            console.log('Forecast data: ', JSON.stringify(forecastData));
            res.set('Content-Type', 'application/json');
            res.send(forecastData);
        });
    });

    app.get('/api/exactify', function (req, res) {
        var song_indexes = [];
        var { time, n_songs, songs_duration } = req.query;
        console.log(
            `[New Exactify Request]\nParams: { Time: ${time}, Num Songs: ${n_songs}, Song Durations: ${songs_duration} }`
        );

        // spawn new child process to call the python script
        const python = spawn('python', [
            './server/exact_playlist.py',
            time,
            n_songs,
            songs_duration
        ]);

        // collect data from script
        python.stdout.on('data', function (data) {
            console.log('Pipe data from python script ...');
            song_indexes.push(JSON.parse(data));
        });

        // in close event we are sure that stream from child process is closed
        python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            // send data to browser
            console.log('solution:', song_indexes);
            res.set('Content-Type', 'application/json');
            res.send(song_indexes);
        });
    });

    app.listen(PORT, function () {
        console.error(
            `Node ${
                isDev ? 'dev server' : 'cluster worker ' + process.pid
            }: listening on port ${PORT}`
        );
    });
}
