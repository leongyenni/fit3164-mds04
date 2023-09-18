import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StockData } from '../types/DataTypes';
import { UTCTimestamp } from 'lightweight-charts';

const useFinanceAPI = (
    symbol: string
): {
    loading: boolean;
    error: any;
    data: StockData | null;
} => {
    const [data, setData] = useState<StockData | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async () => {
        try {
            const response = await axios.get<string>(
                `https://query1.finance.yahoo.com/v7/finance/download/${symbol}`
            );

            const raw_data: string[] = response.data.split(',');

            const dateParts = raw_data[6].split('\n')[1].split('-'); // Assuming date format: day-month-year
            const year = parseInt(dateParts[0]);
            const month = parseInt(dateParts[1]);
            const day = parseInt(dateParts[2]);
            const date = new Date(Date.UTC(year, month, day));
            const unixTimestamp = (date.getTime() / 1000) as UTCTimestamp;

            setData({
                symbol: symbol,
                date: unixTimestamp,
                open: parseFloat(raw_data[7]),
                high: parseFloat(raw_data[8]),
                low: parseFloat(raw_data[9]),
                close: parseFloat(raw_data[10]),
                adjClose: parseFloat(raw_data[11]),
                volume: parseFloat(raw_data[12])
            });

            setLoading(false);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching stock data:', error);
            setError(error);
            setLoading(false);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchData();
    }, []);

    return { loading, error, data };
};

export default useFinanceAPI;
