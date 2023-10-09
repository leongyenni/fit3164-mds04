import { StatsData } from './DataTypes';

export interface SearchBarProps {
    className?: string;
    inputSymbol?: string;
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

export interface ToolButtonProps {
    icon: React.ReactNode;
    onClick?: () => void;
    tooltip: string;
}

export interface ToolButtonTooltipProps {
    tooltip: string;
}

export interface StatsDataContainerProps {
    statsData: StatsData;
}

export interface ChartSideMenuProps {
    statsData: StatsData;
}

export interface ButtonProps {
    elementId: string;
}

export interface DownloadButtonProps extends ButtonProps {
    filename: string;
}
