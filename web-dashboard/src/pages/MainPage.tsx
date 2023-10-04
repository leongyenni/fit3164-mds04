import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';
import { useEffect, useState, useMemo } from 'react';
import useTSFinanceAPI from '../hooks/useTSFinanceAPI';
import { Chart } from '../components/Chart';
import Searchbar from '../components/SearchBar';
import Legend from '../components/Legend';
import { ForecastChart } from '../components/ForecastChart';
import RangeSwitcher from '../components/RangeSwitcher';
import Footer from '../components/Footer';
import { color } from '../styles/colors';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

export const MainPage: React.FC = () => {
    const router = useRouter();

    const navigateToStartPage = () => {
        router.push({ pathname: '/' });
    };

    const navigateToErrorPage = () => {
        router.push({ pathname: '/ErrorPage' });
    };

    const tickerSymbol = router.query['tickerSymbol'] as string;

    const timeRangeData = useSelector((state: AppState) => state.timeRangeData);

    const tickerData = useTSFinanceAPI(
        tickerSymbol,
        timeRangeData.timeInterval,
        timeRangeData.timeRange
    );
    const historicalData = useTSFinanceAPI(tickerSymbol, '1h', '10d');
    const [forecastData, setForecastData] = useState([]);
    const [startForecast, setStartForecast] = useState(false);

    useEffect(() => {
        setStartForecast(false);
    }, [tickerSymbol]);

    const handleForecast = () => {
        setStartForecast(true);

        axios
            .post(
                'http://localhost:5000/api/model',
                { historicalData: historicalData.data },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((response) => {
                setForecastData(response.data.forecastData);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    if (tickerData.loading || historicalData.loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner />
                <div className="ml-3 text-gray-400 text-2xl animate-pulse ">
                    Loading...
                </div>
            </div>
        );
    }

    if (
        !tickerData.data ||
        !historicalData.data ||
        tickerData.error ||
        historicalData.error
    ) {
        navigateToErrorPage();
        return <></>;
    }

    return (
        <div id="main-page">
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
                    data={tickerData.data}
                    timeInterval={timeRangeData.timeInterval}
                />
            </div>

            <hr className="border-t border-gray-800 mb-1" />

            <RangeSwitcher />

            <div className="mt-20">
                <div
                    className="p-10 rounded-xl"
                    style={{ backgroundColor: color.backgroundColor2 }}
                    id="forecast-chart-div"
                >
                    <div
                        className={`grid mb-5 ${
                            startForecast ? 'grid-cols-2' : ''
                        } text-center text-xl font-medium tracking-wider`}
                    >
                        <div>Historical data</div>
                        {startForecast && <div>Forecast data</div>}
                    </div>
                    <ForecastChart
                        historicalData={historicalData.data.slice(
                            0,
                            historicalData.data.length / 2 + 1
                        )}
                        forecastData={historicalData.data.slice(
                            historicalData.data.length / 2,
                            historicalData.data.length
                        )}
                        startForecast={startForecast}
                    />
                </div>
            </div>
            <div className="my-5 align-center">
                {!startForecast && (
                    <button
                        className="bg-sky-600 py-2 px-4 rounded-md hover:bg-sky-900"
                        onClick={() => handleForecast()}
                    >
                        Start Forecast
                    </button>
                )}

                {startForecast && forecastData.length > 1 && (
                    <div className="text-lg"> Predicted closing price </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MainPage;
