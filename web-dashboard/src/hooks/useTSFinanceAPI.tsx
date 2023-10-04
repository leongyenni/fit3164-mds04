/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { StockData } from '../types/DataTypes';

const useTSFinanceAPI = (
    symbol: string,
    interval: string = '1d',
    range: string = '1mo'
): {
    loading: boolean;
    error: any;
    data: StockData[];
} => {
    const [data, setData] = useState<StockData[]>([]);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const params = {
        interval: interval,
        range: range
    };

    const apiUrl = `http://localhost:5000/api/time-series-stock-data/${symbol}`;
    const fetchStockData = () => {
        axios
            .get(apiUrl, { params })
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching stock data:', err);
                setError(err);
                setLoading(false);
            });
    };

    // Fetch data when the component mounts
    useEffect(() => {
        if (!symbol) {
            return;
        }
        fetchStockData();
        console.log('fetch TS data');
    }, [symbol, interval, range]);

    return { loading, error, data };
};

export default useTSFinanceAPI;
