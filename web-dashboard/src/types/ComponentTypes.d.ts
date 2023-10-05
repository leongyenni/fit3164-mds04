import { StatsData } from "./DataTypes";

export interface SearchBarProps {
    className?: string;
};

export interface SearchItemProps {
    tickerSymbol: TickerData;
    onClick: (tickerSymbol: string) => void;
};

export interface StockDataItemProps {
    symbol: string;
};

export interface ChartProps {
    data: StockData[];
    timeInterval: string;
};

export interface ForecastChartProps {
    historicalData: StockData[];
    forecastData: StockData[];
    startForecast: boolean;
};

export interface ChartLegendsProps {
    statsData: StatsData
}

export interface ChartControlsProps {
    statsData: StatsData;
}
