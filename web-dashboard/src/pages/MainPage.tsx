import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useTSFinanceAPI from '../hooks/useTSFinanceAPI';
import { Chart } from '../components/Chart';
import ChartLegends from '../components/ChartLegends';
import { ForecastChart } from '../components/ForecastChart';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import useFinanceStatsAPI from '../hooks/useFinanceStatsAPI';
import ChartSideMenu from '../components/ChartSideMenu';
import Header from '../components/Header';
import ChartControls from '../components/ChartControls';
import { color } from '../styles/colors';

export const MainPage: React.FC = () => {
    const router = useRouter();

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

    const statsData = useFinanceStatsAPI(tickerSymbol);

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

    if (tickerData.loading || historicalData.loading || statsData.loading) {
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
        !statsData.data ||
        tickerData.error ||
        historicalData.error ||
        statsData.error
    ) {
        return <div>Error</div>;
    }

    return (
        <div id="main-page">
            <Header />

            <div className="flex" id="chart-whole">
                <div className="flex-1" id="chart">
                    <ChartLegends statsData={statsData.data} />
                    <div className="pt-2" id="chart-div">
                        <Chart
                            data={tickerData.data}
                            timeInterval={timeRangeData.timeInterval}
                        />
                    </div>
                    <hr className="border-t border-gray-800 " />
                    <ChartControls statsData={statsData.data} />
                </div>

                <ChartSideMenu />
            </div>

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
