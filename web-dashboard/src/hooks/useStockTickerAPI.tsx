/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Ticker } from '../types/DataTypes';

const useStockTickerAPI = (letter: string = ''): Ticker[] => {
    const [tickers, setTickers] = useState<Ticker[]>([]);
    const [filteredTicker, setFilteredTicker] = useState<Ticker[]>(tickers);

    const apiUrl = `http://localhost:5000/api/stock-tickers`;
    const fetchStockTickers = () => {
        axios
            .get(apiUrl)
            .then((response) => {
                setTickers(response.data);
            })
            .catch((err) => {
                console.error('Error fetching stock tickers:', err);
            });
    };

    useEffect(() => {
        fetchStockTickers();
    }, []);

    useEffect(() => {
        const filteredTickerSymbol = tickers.filter((ticker) =>
            ticker.symbol.startsWith(letter)
        );
        setFilteredTicker(filteredTickerSymbol);
    }, [letter]);

    return filteredTicker;
};

export default useStockTickerAPI;
