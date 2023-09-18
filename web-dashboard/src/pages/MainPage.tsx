import { useState } from 'react';
import { useRouter } from 'next/router';
import useTSFinanceAPI from '../hooks/useTSFinanceAPI';
import { Chart } from '../components/Chart';
import LoadingBar from '../components/LoadingBar';
import RangeSwitcher from '../components/RangeSwitcher';
import Searchbar from '../components/SearchBar';
import Label from '../components/Label';
import { ForecastChart } from '../components/ForecastChart';

export const MainPage: React.FC = () => {
    const router = useRouter();
    const tickerSymbol = router.query.tickerSymbol as string;

    const [timeRange, setTimeRange] = useState<string>('1y');
    const [timeInterval, setTimeInterval] = useState<string>('1d');

    const tickerData = useTSFinanceAPI(tickerSymbol, timeInterval, timeRange);

    const switchTimeRange = (newTimeRange: string): void => {
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

    const navigateToStartPage = () => {
        router.push({ pathname: '/' });
    };

    if (tickerData.loading) {
        return <LoadingBar />;
    } else {
        return (
            <div>
                <div className="w-full relative">
                    <div className="grid grid-flow-col-dense auto-cols-max grid-cols-[1fr,auto] my-6">
                        <Searchbar />
                        <p
                            className="text-3xl mr-6 cursor-pointer glow"
                            onClick={() => navigateToStartPage()}
                        >
                            TradeTrens $ | MDS04
                        </p>
                    </div>
                    <hr className="border-t border-gray-500 my-4" />
                </div>

                <div className="mt-4 cursor-default">
                    <span className="text-2xl">{tickerSymbol}</span>
                    <Label />
                </div>

                <div className="py-4 mr-6" id="chart-div">
                    <Chart
                        data={tickerData.data!}
                        timeInterval={timeInterval}
                    />
                </div>

                <hr className="border-t border-gray-500 mb-2" />

                <div className="inline-flex">
                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
                        Prev
                    </button>
                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4">
                        Prev
                    </button>
                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
                        Next
                    </button>
                </div>

                {/* <div className="py-1 flex space-x-3 mb-5">
                    <RangeSwitcher
                        range="1 day"
                        onClick={() => switchTimeRange('1d')}
                    />
                    <RangeSwitcher
                        range="1 week"
                        onClick={() => switchTimeRange('1wk')}
                    />
                    <RangeSwitcher
                        range="1 month"
                        onClick={() => switchTimeRange('1mo')}
                    />
                    <RangeSwitcher
                        range="3 months"
                        onClick={() => switchTimeRange('3mo')}
                    />
                    <RangeSwitcher
                        range="6 months"
                        onClick={() => switchTimeRange('6mo')}
                    />
                    <RangeSwitcher
                        range="1 year"
                        onClick={() => switchTimeRange('1y')}
                    />
                </div> */}

                <div className="my-60 py-5 mr-6" id="forecast-chart-div">
                    <ForecastChart data={tickerData.data!} />
                </div>
            </div>
        );
    }
};

export default MainPage;
