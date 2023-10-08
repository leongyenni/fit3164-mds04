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
        axios
            .post(
                'http://localhost:5000/api/model',
                { historicalData: historicalData.data },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((response) => {
                setForecastData(response.data);
                setStartForecast(true);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const checkLoading = setTimeout(() => {
            if (
                tickerData.loading ||
                historicalData.loading ||
                statsData.loading
            ) {
                setShowLoading(true);
            }
        }, 3000);

        return () => clearTimeout(checkLoading);
    }, [tickerData.loading, historicalData.loading, statsData.loading]);

    if (showLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner />
                <div className="ml-3 text-gray-400 text-2xl animate-pulse ">
                    Loading...
                </div>
            </div>
        );
    } else if (
        (tickerData.loading || historicalData.loading || statsData.loading) &&
        !showLoading
    ) {
        return <div />;
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
                    className="flex-1 w-auto pl-4"
                    id="chart-fullscreen"
                    style={{ backgroundColor: color.backgroundColor }}
                >
                    <ChartLegends statsData={statsData.data} />
                    <div className="pt-3" id="chart-div">
                        <Chart
                            data={tickerData.data}
                            timeInterval={timeRangeData.timeInterval}
                        />
                    </div>
                    <hr className="border-t border-gray-800 " />
                    <ChartTools statsData={statsData.data} />
                </div>
                <ChartSideMenu />
            </div>

            <div className="mt-16">
                <div
                    className="p-4 rounded-md"
                    style={{ backgroundColor: color.backgroundColor2 }}
                    id="forecast-chart-div"
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
                                                historicalData.data.length - 1
                                            ].date
                                        )
                                    )[0]
                                }
                            </div>
                        )}
                    </div>

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
            <div className="my-5 align-center">
                {!startForecast && (
                    <button
                        className="bg-sky-600 py-2 px-4 rounded-md hover:bg-sky-900"
                        onClick={() => handleForecast()}
                    >
                        Start Forecast
                    </button>
                )}

                {startForecast && (
                    <div className="text-lg mt-10 text-center">
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
            <Footer />
        </div>
    );
};

export default MainPage;
