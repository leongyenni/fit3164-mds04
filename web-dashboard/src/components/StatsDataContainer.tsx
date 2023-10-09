import React, { useState } from 'react';
import { StatsDataContainerProps } from '../types/ComponentTypes';
import { volumeFormatter } from '../utils/formattingUtils';
import { color } from '../styles/colors';

const StatsDataContainer: React.FC<StatsDataContainerProps> = ({
    statsData,
    tickerSymbol
}) => {
    return (
        <div className="h-auto w-80 p-2 cursor-default border-gray-800 border-l-2 tracking-wide">
            <div className="m-2 pb-4">
                <div className="text-2xl pb-2 font-bold">{tickerSymbol}</div>   
                <div className="text-1xl pb-2">{statsData.companyName}</div>

                <div className="pr-4 pb-2 font-semibold">
                    <span className="text-4xl pr-2">
                        {statsData.marketPrice}
                    </span>{' '}
                    <span className="text-md font-normal">USD</span>
                    <span
                        style={{
                            color:
                                statsData.marketChange < 0
                                    ? color.downColor
                                    : color.upColor
                        }}
                        className="ml-4 px-1.5 font-bold text-md rounded-md"
                    >
                        {statsData.marketChange.toFixed(2)} /{' '}
                        {statsData.marketChangePct}
                    </span>
                </div>

                <div
                    className="font-extralight pb-2 text-gray-400"
                >
                    &#x2022; MARKET {statsData.marketState.toLocaleUpperCase()}
                </div>

                <div className="p-1 mt-3 bg-transparent">
                    <div className="flex justify-between items-center">
                        <div className="text-white text-xs">
                            {statsData.marketDayLow}
                        </div>
                        <div className="mb-1 text-center">
                            Day's Range
                        </div>
                        <div className="text-white text-xs">
                            {statsData.marketDayHigh}
                        </div>
                    </div>
                    <div className="w-full max-w-xl h-3 bg-gradient-to-r from-red-500 to-green-500 rounded-full overflow-hidden"></div>
                </div>


            </div>

            <div className="m-2 border-gray-800 border-t-2">
                <div className="font-bold my-4 text-xl">Key Stats</div>

                <div className="flex justify-between items-center mb-2">
                    <div className="">Previous Close</div>
                    <div className="text-right">
                        {statsData.marketPrevClose.toFixed(2)}
                    </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <div className="">Volume</div>
                    <div className="text-right ">
                        {volumeFormatter(
                            statsData.marketDayVolume
                                ? statsData.marketDayVolume
                                : 0
                        )}
                    </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <div className="">Market Cap</div>
                    <div className="text-right font-semibold">
                        {statsData.marketCap}
                    </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <div className="">Dividends Yield</div>
                    <div className="text-right font-semibold">
                        {statsData.dividendYield}
                    </div>
                </div>
                <div className="flex justify-between items-center mb-2 ">
                    <div className="">P/E Ratio</div>
                    <div className="text-right font-semibold">
                        {statsData.peRatio}
                    </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <div className="">Total Shares</div>
                    <div className="text-right font-semibold">
                        {statsData.totalShares}
                    </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                    <div className="">Day Range</div>
                    <div className="text-right font-semibold">
                        ${statsData.marketDayLow} - ${statsData.marketDayHigh}
                    </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                    <div className="">52-week Range</div>
                    <div className="text-right font-semibold">
                        ${statsData.fiftyTwoWeekLow} - $
                        {statsData.fiftyTwoWeekHigh}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsDataContainer;
