/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useEffect, useState } from 'react';

const useStockTickerNameAPI = (symbol: string = ''): string => {
    const [tickerName, setTickerName] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `https://ticker-2e1ica8b9.now.sh/keyword/${symbol}`;
                console.log('URL:', url); 
                const response = await axios.get(url);
                console.log('Response:', response.data); 
                const result = response.data[0].name;
                setTickerName(result);
            } catch (error) {
                console.log('Error getting stock ticker name: ', error);
            }
        };

        fetchData(); 
        console.log(tickerName);

    }, [symbol]); 

    return tickerName;
};

export default useStockTickerNameAPI;
