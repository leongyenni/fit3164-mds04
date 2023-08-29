import axios from 'axios';
import { useEffect, useState } from 'react';
import { Ticker } from '../DataType';

const useStockTickerAPI = (letter: string = ''): Ticker[] => {
    const [tickers, setTickers] = useState<Ticker[]>([]);
    const [filteredTicker, setFilteredTicker] = useState<Ticker[]>(tickers);

    const fetchStockTickers = async (letter: string = '') => {
        try {
            const url =
                'https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&download=true';
            const response = await axios.get(url);
            const result = response.data;
            const tickerSymbols = result.data.rows.flatMap((ticker: any) =>
                String(ticker.symbol).startsWith(letter.toUpperCase())
                    ? {
                          symbol: String(ticker.symbol).replace('^', '-P'),
                          company_name: ticker.name
                      }
                    : []
            );
            setTickers(tickerSymbols);
        } catch (error) {
            console.log('Error getting stock tickers: ', error);
        }
    };

    useEffect(() => {
        fetchStockTickers();
        console.log('fetch');
    }, []);

    useEffect(() => {
        const filteredTickerSymbol = tickers.filter((symbol) =>
            symbol.symbol.startsWith(letter)
        );
        setFilteredTicker(filteredTickerSymbol);

        console.log('filter');
    }, [letter]);

    return filteredTicker;
};

export default useStockTickerAPI;
