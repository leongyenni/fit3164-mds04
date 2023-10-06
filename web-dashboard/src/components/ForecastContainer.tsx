import React from 'react';
import { color } from '../styles/colors';
import { StockData } from '../types/DataTypes';
import Image from 'next/image';

interface Props {
    historicalData: StockData[];
    forecastData: number[];
}

const ForecastContainer: React.FC<Props> = ({ historicalData, forecastData }) => {
    const maxForecast = Math.max(...forecastData);
    const minForecast = Math.min(...forecastData);
    const averageForecast = forecastData.reduce((acc, value) => acc + value, 0) / forecastData.length;

    const maxHistorical = Math.max(...historicalData?.map(data => data.close));
    const minHistorical = Math.min(...historicalData?.map(data => data.close));
    const averageHistorical = historicalData?.reduce((acc, data) => acc + data.close, 0) / historicalData.length;

    console.log(maxForecast, maxHistorical)

    const maxDiff = maxForecast-maxHistorical
    const avgDiff = averageForecast-averageHistorical
    const minDiff = minForecast-minHistorical

    const maxDiffPercentage = (maxForecast - maxHistorical) / maxHistorical * 100;
    const avgDiffPercentage = (averageForecast - averageHistorical) / averageHistorical * 100;
    const minDiffPercentage = (minForecast - minHistorical) / minHistorical * 100;

    return (
        <div className="forecast-container mt-5 p-5 rounded-md" style={{ backgroundColor: color.backgroundColor2 }}>
            <div className="flex justify-between">
                <div className="flex-1 flex flex-col items-center border-r border-gray-300">
                    <span className="text-center">Highest:</span>
                    <span className="text-center text-3xl pt-1 glowing-up">{maxForecast.toFixed(2)} USD</span>
                    <div className="flex items-center pt-1">
                        <Image
                            src={maxDiff < 0 ? '/images/stock-market-decrease.png' : '/images/stock-market-increase.png'}
                            alt={maxDiff < 0 ? 'Stock Market Decrease' : 'Stock Market Increase'}
                            className="pb-1 pl-1 pr-3 h-5"
                            width={35}
                            height={18}
                        />
                        <span className={`${maxDiff < 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {maxDiff.toFixed(2)}/{maxDiffPercentage.toFixed(2)}%
                        </span>
                        <span className='ml-2'> Yesterday</span>
                    </div>
                </div>
                
                <div className="flex-1 flex flex-col items-center border-r border-gray-300">
                    <span className="text-center">Average:</span>
                    <span className="text-center text-3xl pt-1 glowing-avg">{averageForecast.toFixed(2)} USD</span>
                    <div className="flex items-center pt-1">
                        <Image
                            src={avgDiff < 0 ? '/images/stock-market-decrease.png' : '/images/stock-market-increase.png'}
                            alt={avgDiff < 0 ? 'Stock Market Decrease' : 'Stock Market Increase'}
                            className="pb-1 pl-1 pr-3 h-5"
                            width={35}
                            height={18}
                        />
                        <span className={`${avgDiff < 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {avgDiff.toFixed(2)}/{avgDiffPercentage.toFixed(2)}%
                        </span>
                        <span className='ml-2'> Yesterday</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center">
                    <span className="text-center">Lowest:</span>
                    <span className="text-center text-3xl pt-1 glowing-down">{minForecast.toFixed(2)} USD</span>
                    <div className="flex items-center pt-1">
                        <Image
                            src={minDiff < 0 ? '/images/stock-market-decrease.png' : '/images/stock-market-increase.png'}
                            alt={minDiff < 0 ? 'Stock Market Decrease' : 'Stock Market Increase'}
                            className="pb-1 pl-1 pr-3 h-5"
                            width={35}
                            height={18}
                        />
                        <span className={`${minDiff < 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {minDiff.toFixed(2)}/{minDiffPercentage.toFixed(2)}%
                        </span>
                        <span className='ml-2'> Yesterday</span>
                    </div>
                </div>
            </div>
        </div>    
    );
}

export default ForecastContainer;
