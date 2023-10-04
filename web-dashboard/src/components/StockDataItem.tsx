import React from 'react';
import { useRouter } from 'next/router';
import useFinanceStatsAPI from '../hooks/useFinanceStatsAPI';
import { StockDataItemProps } from '../types/ComponentTypes';
import { OHLCFormatter } from '../utils/formattingUtils';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';

const StockDataItem: React.FC<StockDataItemProps> = ({ symbol }) => {
    const { loading, error, data } = useFinanceStatsAPI(symbol);

    const router = useRouter();

    const handleClick = (tickerSymbol: string) => {
        router.push({
            pathname: `/MainPage`,
            query: { tickerSymbol: tickerSymbol }
        });
    };

    if (loading) {
        return (
            <div className="grid-item flex justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!data) {
        return <div>No data available</div>;
    }

    const isMarketIncrease = data.marketChange >= 0;

    return (
        <div
            className="grid-item flex-shrink-0"
            onClick={() => handleClick(symbol)}
        >
            <div className="text-2xl text-white font-bold opacity-1">
                {symbol}
            </div>
            <div>{data.companyName}</div>
            <br></br>
            <ul>
                <li key={data.companyName}>
                    <div
                        className={`${
                            isMarketIncrease ? 'glowing-up' : 'glowing-down'
                        } text-2xl font-bold text-white`}
                    >
                        {OHLCFormatter(data.marketPrice)} USD
                    </div>
                    <div className="flex align-center">
                        <div className="flex items-center pt-3">
                            <Image
                                src={
                                    isMarketIncrease
                                        ? '/images/stock-market-increase.png'
                                        : '/images/stock-market-decrease.png'
                                }
                                alt={
                                    isMarketIncrease
                                        ? 'Stock Market Increase'
                                        : 'Stock Market Decrease'
                                }
                                className="pb-1 pl-1 pr-3 h-5"
                                width={35}
                                height={18}
                            />
                            <div
                                className={
                                    isMarketIncrease
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                }
                            >
                                {data.marketChange.toFixed(2)}/
                                {data.marketChangePct}
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default StockDataItem;
