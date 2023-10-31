import React from 'react';
import { color } from '../styles/colors';
import { StockData } from '../types/DataTypes';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface Props {
    historicalData: StockData[];
    forecastData: number[];
}

const ForecastContainer: React.FC<Props> = ({
    historicalData,
    forecastData
}) => {
    const maxForecast = Math.max(...forecastData);
    const minForecast = Math.min(...forecastData);
    const averageForecast =
        forecastData.reduce((acc, value) => acc + value, 0) /
        forecastData.length;

    const maxHistorical = Math.max(
        ...historicalData?.map((data) => data.close)
    );
    const minHistorical = Math.min(
        ...historicalData?.map((data) => data.close)
    );
    const averageHistorical =
        historicalData?.reduce((acc, data) => acc + data.close, 0) /
        historicalData.length;

    const maxDiff = maxForecast - maxHistorical;
    const avgDiff = averageForecast - averageHistorical;
    const minDiff = minForecast - minHistorical;

    const maxDiffPercentage =
        ((maxForecast - maxHistorical) / maxHistorical) * 100;
    const avgDiffPercentage =
        ((averageForecast - averageHistorical) / averageHistorical) * 100;
    const minDiffPercentage =
        ((minForecast - minHistorical) / minHistorical) * 100;

    return (
        <div
            className="forecast-container mt-5 p-5 rounded-md"
            style={{ backgroundColor: color.backgroundColor2 }}
        >
            <div className="flex justify-between tracking-wide">
                <div className="flex-1 flex flex-col items-center border-r border-gray-300">
                    <span className="text-center text-lg">Highest:</span>
                    <span className="text-center text-3xl pt-1 glowing-up font-semibold">
                        {maxForecast.toFixed(2)} USD
                    </span>
                    <div className="flex items-center mt-2">
                        {maxDiff < 0 ? (
                            <FiTrendingDown className="text-red-500" />
                        ) : (
                            <FiTrendingUp className="text-green-500" />
                        )}
                        <span
                            className={`pl-4 ${
                                maxDiff < 0 ? 'text-red-500' : 'text-green-500'
                            }`}
                        >
                            {maxDiff.toFixed(2)}/{maxDiffPercentage.toFixed(2)}%
                        </span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center border-r border-gray-300">
                    <span className="text-center text-lg">Average:</span>
                    <span className="text-center text-3xl pt-1 glowing-avg font-semibold">
                        {averageForecast.toFixed(2)} USD
                    </span>
                    <div className="flex items-center mt-2">
                        {avgDiff < 0 ? (
                            <FiTrendingDown className="text-red-500" />
                        ) : (
                            <FiTrendingUp className="text-green-500" />
                        )}

                        <span
                            className={`pl-4 ${
                                avgDiff < 0 ? 'text-red-500' : 'text-green-500'
                            }`}
                        >
                            {avgDiff.toFixed(2)}/{avgDiffPercentage.toFixed(2)}%
                        </span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center">
                    <span className="text-center text-lg">Lowest:</span>
                    <span className="text-center text-3xl pt-1 glowing-down font-semibold">
                        {minForecast.toFixed(2)} USD
                    </span>
                    <div className="flex items-center mt-2">
                        {minDiff < 0 ? (
                            <FiTrendingDown className="text-red-500" />
                        ) : (
                            <FiTrendingUp className="text-green-500" />
                        )}
                        <span
                            className={`pl-4 ${
                                minDiff < 0 ? 'text-red-500' : 'text-green-500'
                            }`}
                        >
                            {minDiff.toFixed(2)}/{minDiffPercentage.toFixed(2)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForecastContainer;
