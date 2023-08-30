import { StockData } from '../DataType';
import useFinanceAPI from '../hooks/useFinanceAPI';
import { ColorType, UTCTimestamp, createChart } from 'lightweight-charts';
import { useRef, useEffect, useState } from 'react';
import { Chart } from '../components/Chart';
import useTSFinanceAPI from '../hooks/useTSFinanceAPI';
import { useRouter } from 'next/router';
import LoadingBar from '../components/LoadingBar';
import '../styles/globals.css';

export const MainPage: React.FC = () => {
    const router = useRouter();
    const tickerSymbol = router.query.tickerSymbol as string;

    const [timeRange, setTimeRange] = useState<string>('1y');
    const [timeInterval, setTimeInterval] = useState<string>('1d');
    const tickerData = useTSFinanceAPI(tickerSymbol, timeInterval, timeRange);

    console.log(tickerData);

    const handleClick = (newTimeRange: string) => {
        setTimeRange(newTimeRange);

        switch (newTimeRange) {
            case '1d':
                setTimeInterval('5m');
                break;
            case '1wk':
                setTimeInterval('1h');
                break;
            // console.log('1h');
            default:
                setTimeInterval('1d');
        }

        // console.log(timeRange);
        // console.log(timeInterval);
    };

    if (tickerData.loading) {
        return <LoadingBar />;
    } else {
        return (
            <div className="relative">
                <div className="text-5xl my-6">{tickerSymbol}</div>
                <hr className="max-w-7xl" />
                <div className="py-5" id="chart-div">
                    <Chart
                        data={tickerData.data!}
                        timeInterval={timeInterval}
                    />
                </div>
                <div className="py-1 absolute ">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => handleClick('1d')}
                    >
                        1 day
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => handleClick('1wk')}
                    >
                        1 week
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => handleClick('1mo')}
                    >
                        1 month
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => handleClick('3mo')}
                    >
                        3 months
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => handleClick('6mo')}
                    >
                        6 months
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => handleClick('1y')}
                    >
                        1 year
                    </button>
                </div>
            </div>
        );
    }
};

export default MainPage;
