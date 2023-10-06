import React from 'react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useFinanceStatsAPI from '../hooks/useFinanceStatsAPI';
import { StockDataItemProps } from '../types/ComponentTypes';
import { OHLCFormatter } from '../utils/formattingUtils';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';

const StockDataItem: React.FC<StockDataItemProps> = ({ symbol }) => {
    const { loading, error, data } = useFinanceStatsAPI(symbol);
    const [showLoading, setShowLoading] = useState(false);

    const router = useRouter();

    const handleClick = (tickerSymbol: string) => {
        router.push({
            pathname: `/MainPage`,
            query: { tickerSymbol: tickerSymbol }
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const checkLoading = setTimeout(() => {
            if (loading) {
                setShowLoading(true);
            }
        }, 3000);

        return () => clearTimeout(checkLoading);
    }, [loading]);

    if (showLoading) {
        return (
            <div className="grid-item flex justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    } else if (loading && !showLoading) {
        return <div />;
    }

    if (!data) {
        return <div>No data available</div>;
    }

    const isMarketIncrease = data.marketChange >= 0;

    // hover:bg-slate-950 hover:bg-opacity-60 hover:border-slate-900 hover:border-2
    return (
        <div
            className="grid-item flex-shrink-0 cursor-pointer mx-20 transform transition-transform 
            duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-slate-950 hover:mr-10 
            hover:ml-4 "
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
