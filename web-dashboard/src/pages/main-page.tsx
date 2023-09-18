import { useState } from 'react';
import { Chart } from '../components/Chart';
import useTSFinanceAPI from '../hooks/useTSFinanceAPI';
import { useRouter } from 'next/router';
import LoadingBar from '../components/LoadingBar';
import RangeSwitcher from '../components/RangeSwitcher';
import Searchbar from '../components/SearchBar';
import Label from '../components/Label';

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
                    <hr className="mt-2 mr-6 text-grey-700 h-0.5" />
                </div>

                <div className="mt-6 cursor-default">
                    <span className="text-3xl"> {tickerSymbol} </span>
                    <Label />
                </div>

                <div className="py-5 mr-6" id="chart-div">
                    <Chart
                        data={tickerData.data!}
                        timeInterval={timeInterval}
                    />
                </div>
                <div className="py-1 flex space-x-2 mb-10">
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
                </div>
            </div>
        );
    }
};

export default MainPage;
