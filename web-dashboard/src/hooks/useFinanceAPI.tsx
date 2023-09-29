import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StockData } from '../types/DataTypes';
import { UTCTimestamp } from 'lightweight-charts';
import { resolve } from 'path';
import { reject } from 'lodash';

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

    const apiUrl = `http://localhost:5000/api/stock-data/${symbol}`;
    const fetchStockData = () => {
        axios
            .get(apiUrl)
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
        fetchStockData();
    }, []);

    return { loading, error, data };
};

export default useFinanceAPI;
