import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useTSFinanceAPI from '../hooks/useTSFinanceAPI';
import useFinanceStatsAPI from '../hooks/useFinanceStatsAPI';
import { color } from '../styles/colors';
import { dateFormatter } from '../utils/formattingUtils';
import { getForecastDate, getHistoricalData, getForecastDate_WeekModel } from '../utils/chartUtils';
import { Chart } from '../components/Chart';
import ChartLegends from '../components/ChartLegends';
import { ForecastChart } from '../components/ForecastChart';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import ChartSideMenu from '../components/ChartSideMenu';
import Header from '../components/Header';
import ChartTools from '../components/ChartTools';
import ForecastContainer from '../components/ForecastContainer';
import Toast from '../components/Toast';
import ForecastChartTools from '../components/ForecastChartTools';
import { StockData } from '../types/DataTypes';

export const MainPage: React.FC = () => {
    const router = useRouter();

    const tickerSymbol = router.query['tickerSymbol'] as string;

    const timeRangeData = useSelector((state: AppState) => state.timeRangeData);

    const tickerData = useTSFinanceAPI(
        tickerSymbol,
        timeRangeData.timeInterval,
        timeRangeData.timeRange
    );

    const preHistoricalData = useTSFinanceAPI(tickerSymbol, '1h', '15d');
    const preHistoricalData_WeekModel = useTSFinanceAPI(tickerSymbol, '1d', '75d');
    const statsData = useFinanceStatsAPI(tickerSymbol);

    const [forecastData, setForecastData] = useState<number[]>([]);
    const [historicalData, setHistoricalData] = useState<StockData[]>([]);
    const [forecastData_WeekModel, setForecastData_WeekModel] = useState<number[]>([]);
    const [historicalData_WeekModel, setHistoricalData_WeekModel] = useState<StockData[]>([]);

    const [displayHistData, setDisplayHistData] = useState<StockData[]>([]);
    const [displayForecastData, setDisplayForecastData] = useState<number[]>([]);

    const [startForecast, setStartForecast] = useState(false);
    const [startForecast_WeekModel, setStartForecast_WeekModel] = useState(false);
    const [isLoadingForecast, setIsLoadingForecast] = useState(false);
    const [showForecastContainer, setShowForecastContainer] = useState(false);
    const [showForecastContainer_WeekModel, setShowForecastContainer_WeekModel] = useState(false);

    const [dropdownValue, setDropdownValue] = useState<'Hourly' | 'Daily'>('Hourly');


    useEffect(() => {
        setStartForecast(false);
        setStartForecast_WeekModel(false);
        setShowForecastContainer(false);
        setShowForecastContainer_WeekModel(false);
    }, [tickerSymbol]);

    useEffect(() => {
        if (startForecast) {
            const timeout = setTimeout(() => {
                setShowForecastContainer(true);
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [startForecast]);

    useEffect(() => {
        if (startForecast_WeekModel) {
            const timeout = setTimeout(() => {
                setShowForecastContainer_WeekModel(true);
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [startForecast_WeekModel]);

    useEffect(() => {
        if (dropdownValue == 'Hourly' && historicalData && historicalData_WeekModel) {
            setDisplayHistData(historicalData);
        } else {
            setDisplayHistData(historicalData_WeekModel);
        }

        if (startForecast && dropdownValue == 'Hourly') {
            setDisplayForecastData(forecastData);
            console.log(forecastData);
        } else {
            setDisplayForecastData(forecastData_WeekModel);
            console.log(forecastData_WeekModel);
        }
        
    }, [dropdownValue, startForecast, startForecast_WeekModel, historicalData, historicalData_WeekModel])

    useEffect(() => {
        console.log(preHistoricalData);
        console.log(preHistoricalData_WeekModel)
        console.log(statsData);
        if (preHistoricalData.data && preHistoricalData_WeekModel && statsData.data) {
            const data = getHistoricalData(
                preHistoricalData.data,
                statsData.data!.marketState
            );
            const data_WeekModel = getHistoricalData(
                preHistoricalData_WeekModel.data,
                statsData.data!.marketState
            );
            setHistoricalData(data);
            setHistoricalData_WeekModel(data_WeekModel);
            setDisplayHistData(data);
            console.log(data);
            console.log(data_WeekModel)
            console.log(historicalData);
            console.log(historicalData_WeekModel)
        }

        console.log('set historical data');
    }, [preHistoricalData.data, preHistoricalData_WeekModel.data, statsData.data]);

    const handleForecast = () => {
        setIsLoadingForecast(true);

        axios
            .post(
                'http://localhost:5000/api/model',
                { historicalData: historicalData },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((response) => {
                setForecastData(response.data);
                setStartForecast(true);
                // setIsLoadingForecast(false);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

            axios
                    .post(
                        'http://localhost:5000/api/weekmodel',
                        { historicalData: historicalData_WeekModel },
                        { headers: { 'Content-Type': 'application/json' } }
                    )
                    .then((response) => {
                        setForecastData_WeekModel(response.data);
                        setStartForecast_WeekModel(true);
                        setIsLoadingForecast(false);
                        console.log(response.data);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            
    };

    if (
        tickerData.loading ||
        preHistoricalData.loading ||
        preHistoricalData_WeekModel.loading ||
        statsData.loading ||
        historicalData.length <= 1 ||
        historicalData_WeekModel.length <= 1
    ) {
        console.log(tickerData);
        console.log(preHistoricalData);
        console.log(preHistoricalData_WeekModel);
        console.log(statsData);
        console.log(historicalData);
        console.log(historicalData_WeekModel);

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
        !preHistoricalData.data ||
        !preHistoricalData_WeekModel.data ||
        !statsData.data ||
        tickerData.error ||
        preHistoricalData.error ||
        preHistoricalData_WeekModel.error ||
        statsData.error
    ) {
        return <div>Error</div>;
    }

    // if (preHistoricalData.data && statsData.data) {
    //     setHistoricalData(
    //         getHistoricalData(
    //             preHistoricalData.data,
    //             statsData.data.marketState
    //         )
    //     );
    // }

    console.log(preHistoricalData.data);
    console.log(preHistoricalData_WeekModel);
    console.log(historicalData);
    console.log(historicalData_WeekModel);

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
                <ChartSideMenu statsData={statsData.data} tickerSymbol={tickerSymbol} />
            </div>
            
            <div className="flex justify-center"> 
                <select 
                    value={dropdownValue} 
                    onChange={(e) => setDropdownValue(e.target.value as 'Hourly' | 'Daily')} 
                    className="text-black mt-4 border rounded px-2 py-1 w-48 text-center"
                >
                    <option value="Hourly">Day Prediction</option>
                    <option value="Daily">Week Prediction</option>
                </select>
            </div>

            <div className="mt-5 relative">
            {(!startForecast) && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900 rounded-md bg-opacity-90">
                    {isLoadingForecast ? (
                        <div className="bg-opacity-75 bg-black text-white p-4 rounded-lg">
                            Loading Forecast...
                        </div>
                    ) : (
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:scale-105 focus:outline-none"
                            onClick={() => handleForecast()}
                        >
                            Start Forecast
                        </button>
                    )}
                </div>
            )}

                <div style={{ backgroundColor: color.backgroundColor }} id="forecast-chart-fullscreen">
                    <div className="p-4 rounded-t-md" style={{ backgroundColor: color.backgroundColor2 }}>
                        <div className={`grid mb-5 ${(startForecast || startForecast_WeekModel) ? 'grid-cols-2' : ''} text-center text-xl font-medium tracking-wider`}>
                            <div>
                                Historical closing price{' '}
                            </div>
                            {(startForecast) && (
                                <div>
                                    Forecasted closing price{' '}
                                </div>
                            )}
                        </div>

                        <div id="forecast-chart-div">
                            <ForecastChart
                                historicalData={displayHistData.slice(-8)}
                                forecastData={displayForecastData}
                                startForecast={startForecast}
                                dropdownValue={dropdownValue}
                            />
                        </div>
                    </div>
                </div>
                <ForecastChartTools />
            </div>
            <div className="my-5 align-center">
                {(showForecastContainer || showForecastContainer_WeekModel) && (historicalData && historicalData_WeekModel) && (
                    <div className="text-2xl tracking-wide mt-10 text-center">
                    Forecasted closing price: 
                    {dropdownValue === 'Hourly' ? (
                        ` ${dateFormatter(
                            getForecastDate(historicalData[historicalData.length-1].date)
                        )[0]}`
                    ) : (
                        ` ${dateFormatter(
                            getForecastDate_WeekModel(
                                historicalData_WeekModel[historicalData_WeekModel.length-1].date
                            )[0]
                        )[0]} to ${dateFormatter(
                            getForecastDate_WeekModel(
                                historicalData_WeekModel[historicalData_WeekModel.length-1].date
                            )[6]
                        )[0]}`
                    )}
                </div>                
                )}
                {(showForecastContainer || showForecastContainer_WeekModel) && (
                    <ForecastContainer
                        historicalData={(displayHistData).slice(-7)}
                        forecastData={displayForecastData}
                    />
                )}
            </div>

            <Toast />
            <Footer />
        </div>
    );
};

export default MainPage;
