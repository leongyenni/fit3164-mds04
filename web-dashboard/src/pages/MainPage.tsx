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
import ChartTools from '../components/ChartTools';
import { color } from '../styles/colors';
import { dateFormatter } from '../utils/formattingUtils';
import ForecastContainer from '../components/ForecastContainer';
import Toast from '../components/Toast';
import ForecastChartTools from '../components/ForecastChartTools';

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

    const [showOverlay, setShowOverlay] = useState(true);
    const [isLoadingForecast, setIsLoadingForecast] = useState(false);

    const statsData = useFinanceStatsAPI(tickerSymbol);

    useEffect(() => {
        setStartForecast(false);
    }, [tickerSymbol]);

    const handleForecast = () => {
        setIsLoadingForecast(true);

        axios
            .post(
                'http://localhost:5000/api/model',
                { historicalData: historicalData.data },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((response) => {
                setForecastData(response.data);
                setStartForecast(true);
                setIsLoadingForecast(false);
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
                    Loading data...
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

    const getForecastDate = (historicalDate: number) => {
        const dateObj = new Date(historicalDate * 1000);

        // If the day is Friday (5 in JavaScript's Date object)
        if (dateObj.getUTCDay() === 5) {
            // Add 3 days to get to Monday
            return (
                new Date(
                    dateObj.getTime() + 3 * 24 * 60 * 60 * 1000
                ).getTime() / 1000
            );
        } else {
            // Otherwise, add 1 day
            return (
                new Date(dateObj.getTime() + 24 * 60 * 60 * 1000).getTime() /
                1000
            );
        }
    };

    return (
        <div id="main-page">
            <Header />

            <div className="flex" id="chart-whole">
                <div
                    id="chart-fullscreen"
                    className="flex-1 w-auto pb-2"
                    style={{ backgroundColor: color.backgroundColor }}
                >
                    <div
                        id="chart-screenshot"
                        className="pl-4"
                        style={{ backgroundColor: color.backgroundColor }}
                    >
                        <ChartLegends statsData={statsData.data} />
                        <div className="pt-3" id="chart-div">
                            <Chart
                                data={tickerData.data}
                                timeInterval={timeRangeData.timeInterval}
                            />
                        </div>
                    </div>

                    <hr className="border-t border-gray-800" />
                    <ChartTools />
                </div>
                <ChartSideMenu statsData={statsData.data} />
            </div>

            <div className="mt-16 relative">
                {!startForecast && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900 rounded-md bg-opacity-90">
                        {isLoadingForecast ? (
                            <div className="bg-opacity-75 bg-black text-white p-4 rounded-lg">
                                Loading Forecast...
                            </div>
                        ) : (
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
                                onClick={() => handleForecast()}
                            >
                                Start Forecast
                            </button>
                        )}
                    </div>
                )}

                <div
                    style={{ backgroundColor: color.backgroundColor }}
                    id="forecast-chart-fullscreen"
                >
                    <div
                        className="p-4 rounded-t-md"
                        style={{ backgroundColor: color.backgroundColor2 }}
                    >
                        <div
                            className={`grid mb-5 ${
                                startForecast ? 'grid-cols-2' : ''
                            } text-center text-xl font-medium tracking-wider`}
                        >
                            <div>
                                Historical closing price:{' '}
                                {
                                    dateFormatter(
                                        historicalData.data[
                                            historicalData.data.length - 1
                                        ].date
                                    )[0]
                                }
                            </div>
                            {startForecast && (
                                <div>
                                    Forecasted closing price :{' '}
                                    {
                                        dateFormatter(
                                            getForecastDate(
                                                historicalData.data[
                                                    historicalData.data.length -
                                                        1
                                                ].date
                                            )
                                        )[0]
                                    }
                                </div>
                            )}
                        </div>

                        <div id="forecast-chart-div">
                            <ForecastChart
                                historicalData={historicalData.data.slice(-8)}
                                forecastData={
                                    startForecast
                                        ? forecastData
                                        : historicalData.data
                                              .slice(-8)
                                              .map((item) => item.close)
                                }
                                startForecast={startForecast}
                            />
                        </div>
                    </div>
                </div>
                <ForecastChartTools />
            </div>
            <div className="my-5 align-center">
                {startForecast && (
                    <div className="text-2xl tracking-wide mt-10 text-center">
                        {' '}
                        Forecasted closing price ({' '}
                        {
                            dateFormatter(
                                getForecastDate(
                                    historicalData.data[
                                        historicalData.data.length - 1
                                    ].date
                                )
                            )[0]
                        }
                        )
                    </div>
                )}
                {startForecast && (
                    <ForecastContainer
                        historicalData={historicalData.data.slice(-7)}
                        forecastData={forecastData}
                    />
                )}
            </div>

            <Toast />
            <Footer />
        </div>
    );
};

export default MainPage;
