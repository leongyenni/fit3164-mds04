import { StatsData } from './DataTypes';

export interface SearchBarProps {
    className?: string;
}

export interface SearchItemProps {
    tickerSymbol: TickerData;
    onClick: (tickerSymbol: string) => void;
}

export interface StockDataItemProps {
    symbol: string;
}

export interface ChartProps {
    data: StockData[];
    timeInterval: string;
}

export interface ForecastChartProps {
    historicalData: StockData[];
    forecastData: number[];
    startForecast: boolean;
}

export interface ChartLegendsProps {
    statsData: StatsData;
}

export interface ChartControlsProps {
    statsData: StatsData;
}

export interface ToolButtonProps {
    icon: React.ReactNode;
    onClick?: () => void;
    tooltip: string;
}
