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

export type TickerData = {
    symbol: string;
    company_name: string;
    netchange: number;
    pctchange: string;
};

export type StatsData = {
    companyName: string;
    quoteType: string;
    marketChangePct: string;
    marketChange: number;
    marketPrice: number;
    analystRating: string;
    marketState: string;
    marketDayHigh: number;
    marketDayLow: number;
    marketDayVolume: number;
    marketPrevClose: number;
    bid: number;
    ask: number;
    marketCap: number;
    peRatio: number;
    dividendRate: number;
    dividendYield: number;
    totalShares: number;
    fiftyTwoWeekLow: number;
    fiftyTwoWeekHigh: number;
    closingTime: UTCTimestamp;
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
