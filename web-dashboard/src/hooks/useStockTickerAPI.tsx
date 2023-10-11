/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { TickerData } from '../types/DataTypes';

const useStockTickerAPI = (letter: string = ''): TickerData[] => {
    const [tickers, setTickers] = useState<Record<string, TickerData[]>>();
    const [filteredTicker, setFilteredTicker] = useState<TickerData[]>([]);

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
        if (tickers) {
            console.log(tickers[0]);
        } else {
            console.log('fetching data');
        }
    }, []);

    useMemo(() => {
        const firstChar = letter.charAt(0).toLocaleLowerCase();
        if (tickers && tickers[firstChar]) {
            setFilteredTicker(
                tickers[firstChar].filter((ticker) =>
                    ticker.symbol.startsWith(letter)
                )
            );
        } else {
            setFilteredTicker([]);
        }
    }, [letter]);

    return filteredTicker;
};

export default useStockTickerAPI;
