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
    x: number;
};

export type ForecastDataState = {
    timestamp: number;
    close: string;
    x: number;
    y: number;
};

export type ChartState = {
    isReset?: boolean;
    isFullscreen?: boolean;
    isSideContainerOpen?: boolean;
};

export type ToastState = {
    showToast: boolean;
    message: string;
};
