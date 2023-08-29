import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TimeSeriesStockData, StockData } from '../DataType';
import { UTCTimestamp } from 'lightweight-charts';

const useTSFinanceAPI = (
    symbol: string,
    interval: string = '1h',
    range: string = '1mo'
): {
    loading: boolean;
    error: any;
    data: StockData[] | null;
} => {
    const [data, setData] = useState<StockData[] | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async () => {
        try {
            const response = await axios.get<TimeSeriesStockData>(
                `https://query1.finance.yahoo.com/v7/finance/chart/${symbol}?interval=${interval}&range=${range}&includeAdjustedClose=true`
            );

            console.log(response.data);
            const result = response.data.chart.result[0];
            const timezone = result.meta.exchangeTimezoneName;

            const raw_data: StockData[] = result.timestamp.map(
                (timestamp: number, index: number) => {
                    return {
                        date: (timestamp +
                            result.meta.gmtoffset) as UTCTimestamp,
                        open: result.indicators.quote[0].open[index],
                        high: result.indicators.quote[0].high[index],
                        low: result.indicators.quote[0].low[index],
                        close: result.indicators.quote[0].close[index],
                        // adjClose: result.indicators.adjclose[0].adjclose[index],
                        adjClose: result.indicators.quote[0].close[index],
                        volume: result.indicators.quote[0].volume[index]
                    };
                }
            );

            console.log(raw_data);
            setData(raw_data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stock data:', error);
            setError(error);
            setLoading(true);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchData();
    }, [symbol, interval, range]);

    console.log(data);
    return { loading, error, data };
};

export default useTSFinanceAPI;
