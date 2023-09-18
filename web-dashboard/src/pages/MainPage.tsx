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
                    <hr className="border-t border-gray-800 my-3" />
                </div>

                <div className="mt-4 cursor-default">
                    <span className="text-4xl font-medium">{tickerSymbol}</span>
                    <Label />
                </div>

                <div className="pt-2" id="chart-div">
                    <Chart
                        data={tickerData.data!}
                        timeInterval={timeInterval}
                    />
                </div>

                <hr className="border-t border-gray-800 mb-1" />

                <div className="inline-flex">
                    <button
                        className=" hover:bg-gray-800 text-lg text-white py-1 px-3 mx-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:font-medium focus:text-blue-400 focus:font-extrabold focus:underline underline-offset-8"
                        onClick={() => switchTimeRange('1d')}
                    >
                        1d
                    </button>
                    <button
                        className=" hover:bg-gray-800 text-lg text-white py-1 px-3 mx-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:font-medium focus:text-blue-400 focus:font-extrabold focus:underline underline-offset-8"
                        onClick={() => switchTimeRange('1wk')}
                    >
                        1w
                    </button>
                    <button
                        className=" hover:bg-gray-800 text-lg text-white py-1 px-3 mx-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:font-medium focus:text-blue-400 focus:font-extrabold focus:underline underline-offset-8"
                        onClick={() => switchTimeRange('1mo')}
                    >
                        1mo
                    </button>
                    <button
                        className=" hover:bg-gray-800 text-lg text-white py-1 px-3 mx-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:font-medium focus:text-blue-400 focus:font-extrabold focus:underline underline-offset-8"
                        onClick={() => switchTimeRange('3mo')}
                    >
                        3mo
                    </button>
                    <button
                        className=" hover:bg-gray-800 text-lg text-white py-1 px-3 mx-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:font-medium focus:text-blue-400 focus:font-extrabold focus:underline underline-offset-8"
                        onClick={() => switchTimeRange('6mo')}
                    >
                        6mo
                    </button>
                    <button
                        className=" hover:bg-gray-800 text-lg text-white py-1 px-3 mx-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:font-medium focus:text-blue-500 focus:font-bold focus:underline underline-offset-8"
                        onClick={() => switchTimeRange('1y')}
                    >
                        1y
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
