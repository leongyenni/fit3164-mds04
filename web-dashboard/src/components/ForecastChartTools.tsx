import React from 'react';
import ScreenshotButton from './buttons/ScreenshotButton';
import DownloadButton from './buttons/DownloadButton';
import { color } from '../styles/colors';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';

const ForecastChartTools: React.FC = () => {
    const stockData = useSelector((state: AppState) => state.stockData);

    return (
        <div
            className="flex justify-between pb-2 rounded-b-md"
            style={{ backgroundColor: color.backgroundColor2 }}
        >
            <div className="flex-1">
                <div> </div>
            </div>

            <div>
                <ScreenshotButton elementId="forecast-chart-fullscreen" />
                <DownloadButton
                    elementId="forecast-chart-fullscreen"
                    filename={`${stockData.symbol}_forecast`}
                />
                {/* <FullscreenButton elementId="forecast-chart-fullscreen" /> */}
            </div>
        </div>
    );
};

export default ForecastChartTools;
