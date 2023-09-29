const express = require('express');
const axios = require('axios');
const cors = require('cors');
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

    app.use(cors());

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

            res.json(stockData);
        } catch (error) {
            console.error('Error fetching stock data:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    });

    app.get('/api/stock-tickers', async (req, res) => {
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
                                .trim()
                        };
                    }
                    return null;
                })
                .filter(Boolean);

            res.json(tickerSymbols);
        } catch (error) {
            console.log('Error getting stock tickers: ', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    });

    app.get('/api/time-series-stock-data/:symbol', async (req, res) => {
        const { symbol } = req.params;
        const { interval, range } = req.query;

        try {
            const response = await axios.get(
                `https://query1.finance.yahoo.com/v7/finance/chart/${symbol}?`,
                {
                    params: {
                        interval,
                        range,
                        includeAdjustedClose: true
                    }
                }
            );

            const result = response.data.chart.result[0];

            const raw_data = result.timestamp.map((timestamp, index) => {
                return {
                    symbol: symbol,
                    date: timestamp + result.meta.gmtoffset,
                    open: result.indicators.quote[0].open[index] ?? 0,
                    high: result.indicators.quote[0].high[index] ?? 0,
                    low: result.indicators.quote[0].low[index] ?? 0,
                    close: result.indicators.quote[0].close[index] ?? 0,
                    // adjClose: result.indicators.adjclose[0].adjclose[index],
                    adjClose: result.indicators.quote[0].close[index] ?? 0,
                    volume: result.indicators.quote[0].volume[index] ?? 0
                };
            });
            res.json(raw_data);
        } catch (error) {
            console.error('Error fetching stock data:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
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
