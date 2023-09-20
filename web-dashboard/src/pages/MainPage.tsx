import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';
import useTSFinanceAPI from '../hooks/useTSFinanceAPI';
import { Chart } from '../components/Chart';
import LoadingBar from '../components/LoadingBar';
import Searchbar from '../components/SearchBar';
import Label from '../components/Legend';
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
    const forecastData = useTSFinanceAPI(tickerSymbol, '5m', '1d');

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
                        timeInterval={timeRangeData.timeInterval}
                    />
                </div>

                <hr className="border-t border-gray-800 mb-1" />

                <RangeSwitcher />

                <div className="my-20 py-5 mr-6" id="forecast-chart-div">
                    <ForecastChart data={forecastData.data!} />
                </div>
            </div>
        );
    }
};

export default MainPage;
