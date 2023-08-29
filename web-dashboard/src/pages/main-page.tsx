import { StockData } from '../DataType';
import useFinanceAPI from '../hooks/useFinanceAPI';
import { ColorType, UTCTimestamp, createChart } from 'lightweight-charts';
import { useRef, useEffect, useState } from 'react';
import { ChartComponent } from '../components/ChartComponent';
import useTSFinanceAPI from '../hooks/useTSFinanceAPI';
import { useRouter } from 'next/router';
import LoadingBar from '../components/LoadingBar';

export const MainPage: React.FC = () => {
    const router = useRouter();
    const tickerSymbol = router.query.tickerSymbol as string;
    const tickerData = useTSFinanceAPI(tickerSymbol);
    const [timeRange, setTimeRange] = useState<string>('1mo');

    if (tickerData.loading) {
        return <LoadingBar />;
    } else {
        return (
            <div>
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => setTimeRange('1d')}
                    >
                        1 day
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => setTimeRange('1w')}
                    >
                        1 week
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => setTimeRange('1mo')}
                    >
                        1 month
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => setTimeRange('3mo')}
                    >
                        3 months
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => setTimeRange('6mo')}
                    >
                        6 months
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => setTimeRange('1y')}
                    >
                        1 year
                    </button>
                </div>
                <ChartComponent data={tickerData.data!} timeRange={timeRange} />
            </div>
        );
    }
};

export default MainPage;
