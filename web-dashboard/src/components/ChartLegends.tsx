import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';
import { ChartLegendsProps } from '../types/ComponentTypes';
import { dateFormatter } from '../utils/formattingUtils';
import { color } from '../styles/colors';

const ChartLegends: React.FC<ChartLegendsProps> = ({ statsData }) => {
    const stockData = useSelector((state: AppState) => state.stockData);

    return (
        <div className="flex justify-between cursor-default">
            <div className="flex-1 text-base tracking-wider">
                <span className="text-2xl font-medium">
                    {statsData.companyName}
                </span>

                {/* <span
                    className="mx-2 px-1 pb-0 mb-0 rounded-md text-sm"
                    style={{
                        color:
                            statsData.marketChange < 0
                                ? color.downColor
                                : color.upColor,
                        backgroundColor:
                            statsData.marketChange < 0
                                ? color.downBgColor
                                : color.upBgColor
                    }}
                >
                    {statsData.marketChange.toFixed(2)}/
                    {statsData.marketChangePct}
                </span> */}

                <span className="font-medium pl-3">O </span>
                <span
                    style={{
                        color: stockData.colour
                    }}
                >
                    {stockData.open}
                </span>
                <span className="font-medium pl-3"> H </span>
                <span
                    style={{
                        color: stockData.colour
                    }}
                >
                    {stockData.high}
                </span>
                <span className="font-medium pl-3"> L </span>
                <span
                    style={{
                        color: stockData.colour
                    }}
                >
                    {stockData.low}
                </span>
                <span className="font-medium pl-3"> C </span>
                <span
                    style={{
                        color: stockData.colour
                    }}
                >
                    {stockData.close}
                </span>
                <span className="font-medium pl-3"> V </span>
                <span
                    style={{
                        color: stockData.colour
                    }}
                >
                    {stockData.volume}
                </span>
            </div>
            <div className="text-base text-slate-400 mr-6">
                Closed: {dateFormatter(statsData.closingTime)} (UTC - 4)
            </div>
        </div>
    );
};

export default ChartLegends;
