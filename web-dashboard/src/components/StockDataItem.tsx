import React from 'react';
import useFinanceAPI from '../hooks/useFinanceAPI';
import { StockDataItemProps } from '../types/LandingPageTypes';
import { currencyFormatter } from '../utils/formattingUtils';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';

const StockDataItem: React.FC<StockDataItemProps> = ({ symbol }) => {
    const { loading, error, data } = useFinanceAPI(symbol);

    if (loading) {
        return (
            <div className="grid-item flex justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    {
        /* Change all 200 belows to previous close price */
    }
    let difference = '0';
    let percentageDifference = '0';

    if (data) {
        difference = (data.close - 200).toFixed(2);
        percentageDifference = ((Number(difference) / 200) * 100).toFixed(2);
    }

    return (
        <div className="grid-item flex-shrink-0">
            <div className="text-2xl text-white font-bold opacity-1">
                {symbol}
            </div>
            <div>Company Name</div> {/* Modify this */}
            <br></br>
            {data ? (
                <ul>
                    <li key={data.date}>
                        <div
                            className={`${
                                data.close < 200 ? 'glowing-down' : 'glowing-up'
                            } text-2xl font-bold text-white opacity-1`}
                        >
                            {data.close.toFixed(2)} USD
                        </div>
                        <div className="flex align-center">
                            {200 < data.close ? (
                                <div className="flex items-center pt-3">
                                    <Image
                                        src="/images/stock-market-increase.png"
                                        alt="Stock Market Increase"
                                        className="pb-1 pl-1 pr-3 h-5"
                                        width={35}
                                        height={18}
                                    />
                                    <div className="text-green-500">
                                        {difference}/{percentageDifference}%
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
                                        {difference}/{percentageDifference}%
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
};

export default StockDataItem;
