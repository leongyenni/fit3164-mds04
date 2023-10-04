export type SearchBarProps = {
    className?: string;
};

export type SearchItemProps = {
    tickerSymbol: TickerData;
    onClick: (tickerSymbol: string) => void;
};

export type StockDataItemProps = {
    symbol: string;
};

export type ChartProps = {
    data: StockData[];
    timeInterval: string;
};

export type ForecastChartProps = {
    historicalData: StockData[];
    forecastData: StockData[];
    startForecast: boolean;
};
