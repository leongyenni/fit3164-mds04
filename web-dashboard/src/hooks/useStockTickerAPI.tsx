import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Ticker } from '../types/DataTypes';

const useStockTickerAPI = (letter: string = ''): Ticker[] => {
    const [tickers, setTickers] = useState<Record<string, Ticker[]>>();
    const [filteredTicker, setFilteredTicker] = useState<Ticker[]>([]);

    const apiUrl = `http://localhost:5000/api/stock-tickers`;

    const fetchStockTickers = () => {
        axios
            .get(apiUrl)
            .then((response) => {
                console.log(response);
                setTickers(response.data);
            })
            .catch((err) => {
                console.error('Error fetching stock tickers:', err);
            });
    };

    useEffect(() => {
        fetchStockTickers();
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
    }, [letter, tickers]);

    console.log(filteredTicker);

    return filteredTicker;
};

export default useStockTickerAPI;
