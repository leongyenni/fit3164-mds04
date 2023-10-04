import React from 'react';
import useFinanceStatsAPI from '../hooks/useFinanceStatsAPI';
import { StockDataItemProps } from '../types/ComponentTypes';
import { OHLCFormatter } from '../utils/formattingUtils';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';

const StockDataItem: React.FC<StockDataItemProps> = ({ symbol }) => {
    const { loading, error, data } = useFinanceStatsAPI(symbol);

    if (loading) {
        return (
            <div className="grid-item flex justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    } else if (error) {
        return <div>Error: {error.message}</div>;
    } else if (data) {
        return (
            <div className="grid-item flex-shrink-0">
                <div className="text-2xl text-white font-bold opacity-1">
                    {symbol}
                </div>
                <div>{data.companyName}</div>
                <br></br>
                {data ? (
                    <ul>
                        <li key={data.companyName}>
                            <div
                                className={`${
                                    data.marketChange >= 0
                                        ? 'glowing-up'
                                        : 'glowing-down'
                                } text-2xl font-bold text-white opacity-1`}
                            >
                                {OHLCFormatter(data.marketPrice)} USD
                            </div>
                            <div className="flex align-center">
                                {data.marketChange >= 0 ? (
                                    <div className="flex items-center pt-3">
                                        <Image
                                            src="/images/stock-market-increase.png"
                                            alt="Stock Market Increase"
                                            className="pb-1 pl-1 pr-3 h-5"
                                            width={35}
                                            height={18}
                                        />
                                        <div className="text-green-500">
                                            {data.marketChange.toFixed(2)}/
                                            {data.marketChangePct}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center pt-3">
                                        <Image
                                            src="/images/stock-market-decrease.png"
                                            alt="Stock Market Decrease"
                                            className="pb-1 pl-1 pr-3 h-5"
                                            width={35}
                                            height={18}
                                        />
                                        <div className="text-red-500">
                                            {data.marketChange.toFixed(2)}/
                                            {data.marketChangePct}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </li>
                    </ul>
                ) : (
                    <div>No data available</div>
                )}
            </div>
        );
    }
};

export default StockDataItem;
