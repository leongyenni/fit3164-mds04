/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { StatsData } from '../types/DataTypes';
import { useState, useEffect } from 'react';

const useFinanceStatsAPI = (symbol: string) => {
    const [data, setData] = useState<StatsData | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const apiUrl = `http://localhost:5000/api/stock-ticker-stats/${symbol}`;

    const fetchStockStats = () => {
        axios
            .get(apiUrl)
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching stock tickers:', err);
                setError(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStockStats();
        console.log(data);
    }, [symbol]);

    return { loading, error, data };
};

export default useFinanceStatsAPI;
