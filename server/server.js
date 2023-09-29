const express = require('express');
const axios = require('axios');
const { UTCTimestamp } = require('lightweight-charts');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3001; // Choose an available port

// Use cors middleware with default options to enable CORS
app.use(cors());

app.get('/sayhi', (req, res) => {
    res.send('hi');
});

// Define a route to fetch stock data
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

app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
});
