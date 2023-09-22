export type TimeRangeState = {
    timeRange: string;
    timeInterval: string;
};

export type StockDataState = {
    timestamp: number;
    symbol: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    colour: string;
};

export type ForecastDataState = {
    timestamp: number;
    close: string;
}
