export type ChartProps = {
    data: StockData[];
    timeInterval: string;
};

export type ForecastChartProps = {
    historicalData: StockData[];
    forecastData: StockData[];
    startForecast: boolean;
};


