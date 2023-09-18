/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TimeSeriesStockData, StockData } from '../types/DataTypes';
import { UTCTimestamp } from 'lightweight-charts';

const useTSFinanceAPI = (
    symbol: string,
    interval: string = '1d',
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

            const raw_data: StockData[] = result.timestamp.map(
                (timestamp: number, index: number) => {
                    return {
                        symbol: symbol,
                        date: (timestamp +
                            result.meta.gmtoffset) as UTCTimestamp,
                        open: result.indicators.quote[0].open[index] ?? 0,
                        high: result.indicators.quote[0].high[index] ?? 0,
                        low: result.indicators.quote[0].low[index] ?? 0,
                        close: result.indicators.quote[0].close[index] ?? 0,
                        // adjClose: result.indicators.adjclose[0].adjclose[index],
                        adjClose: result.indicators.quote[0].close[index] ?? 0,
                        volume: result.indicators.quote[0].volume[index] ?? 0
                    };
                }
            );

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
