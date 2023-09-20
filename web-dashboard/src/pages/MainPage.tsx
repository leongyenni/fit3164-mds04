import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';
import { useEffect, useState } from 'react';
import useTSFinanceAPI from '../hooks/useTSFinanceAPI';
import { Chart } from '../components/Chart';
import LoadingBar from '../components/LoadingBar';
import Searchbar from '../components/SearchBar';
import Legend from '../components/Legend';
import { ForecastChart } from '../components/ForecastChart';
import RangeSwitcher from '../components/RangeSwitcher';

export const MainPage: React.FC = () => {
    const router = useRouter();
    const tickerSymbol = router.query.tickerSymbol as string;

    const timeRangeData = useSelector((state: AppState) => state.timeRangeData);

    const tickerData = useTSFinanceAPI(
        tickerSymbol,
        timeRangeData.timeInterval,
        timeRangeData.timeRange
    );
    const historicalData = useTSFinanceAPI(tickerSymbol, '1h', '2d');
    // const forecastData = useTSFinanceAPI(tickerSymbol, '1h', '1d');

    const [startForecast, setStartForecast] = useState(false);

    useEffect(() => {
        setStartForecast(false);
    }, [tickerSymbol]);

    const getData = () => {
        return new Promise((resolve, reject) =>
            fetch('http://localhost:5000/api').then((response) => {
                console.log(response.json());
            })
        );
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
                    <Legend />
                </div>

                <div className="pt-2" id="chart-div">
                    <Chart
                        data={tickerData.data!}
                        timeInterval={timeRangeData.timeInterval}
                    />
                </div>

                <hr className="border-t border-gray-800 mb-1" />

                <RangeSwitcher />

                <div className="my-10">
                    <button
                        className="bg-sky-600 py-3 px-4 rounded-lg"
                        onClick={() => setStartForecast(true)}
                    >
                        Start Forecast
                    </button>
                </div>

                <div className="my-5 py-5 mr-6" id="forecast-chart-div">
                    <ForecastChart
                        historicalData={
                            historicalData.data?.slice(
                                0,
                                historicalData.data.length/2+1
                            )!
                        }
                        forecastData={
                            historicalData.data?.slice(
                                historicalData.data.length/2,
                                historicalData.data.length
                            )!
                        }
                        startForecast={startForecast}
                    />
                </div>
            </div>
        );
    }
};

export default MainPage;
