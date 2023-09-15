import { StockData } from '../DataType';
import useFinanceAPI from '../hooks/useFinanceAPI';
import { ColorType, UTCTimestamp, createChart } from 'lightweight-charts';
import { useRef, useEffect, useState } from 'react';
import { Chart } from '../components/Chart';
import useTSFinanceAPI from '../hooks/useTSFinanceAPI';
import { useRouter } from 'next/router';
import LoadingBar from '../components/LoadingBar';
import '../styles/globals.css';
import RangeSwitcher from '../components/RangeSwitcher';
import Searchbar from '../components/SearchBar';

export const MainPage: React.FC = () => {
    const router = useRouter();
    const tickerSymbol = router.query.tickerSymbol as string;

    const [timeRange, setTimeRange] = useState<string>('1y');
    const [timeInterval, setTimeInterval] = useState<string>('1d');
    const tickerData = useTSFinanceAPI(tickerSymbol, timeInterval, timeRange);

    console.log(tickerData);

    const handleClick = (newTimeRange: string): void => {
        setTimeRange(newTimeRange);

        switch (newTimeRange) {
            case '1d':
                setTimeInterval('5m');
                break;
            case '1wk':
                setTimeInterval('1h');
                break;
            default:
                setTimeInterval('1d');
        }
    };

    if (tickerData.loading) {
        return <LoadingBar />;
    } else {
        return (
            <div>
              
                <div className="w-full relative">
                    <div className="grid grid-flow-col-dense auto-cols-max grid-cols-[1fr,auto] my-6">
                        <Searchbar />
                        <p className="text-3xl mr-6 glow">
                            TradeTrens $ | MDS04
                        </p>
                    </div>
                    <hr className="mt-2 mr-6" />
                </div>

                <div className="text-5xl mt-6">{tickerSymbol}</div>
                <div className="py-5 mr-6" id="chart-div">
                    <Chart
                        data={tickerData.data!}
                        timeInterval={timeInterval}
                    />
                </div>
                <div className="py-1 flex space-x-2 mb-10">
                    <RangeSwitcher
                        range="1 day"
                        onClick={() => handleClick('1d')}
                    />
                    <RangeSwitcher
                        range="1 week"
                        onClick={() => handleClick('1wk')}
                    />
                    <RangeSwitcher
                        range="1 month"
                        onClick={() => handleClick('1mo')}
                    />
                    <RangeSwitcher
                        range="3 months"
                        onClick={() => handleClick('3mo')}
                    />
                    <RangeSwitcher
                        range="6 months"
                        onClick={() => handleClick('6mo')}
                    />
                    <RangeSwitcher
                        range="1 year"
                        onClick={() => handleClick('1y')}
                    />
                </div>
            </div>
        );
    }
};

export default MainPage;
