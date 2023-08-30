export type StockData = {
    symbol: string;
    date: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
    adjClose: number;
    volume: number;
};

export type Ticker = {
    symbol: string;
    company_name: string;
};

export type TimeSeriesStockData = {
    chart: {
        result: {
            meta: {
                currency: string;
                symbol: string;
                timezone: string;
                exchangeTimezoneName: string;
                gmtoffset: long;
            };
            timestamp: number[];
            indicators: {
                quote: {
                    volume: number[];
                    open: number[];
                    high: number[];
                    low: number[];
                    close: number[];
                }[];
                adjclose: {
                    adjclose: number[];
                }[];
            };
        }[];
    };
};

export type UTCTimestamp = Nominal<number, 'UTCTimestamp'>;
