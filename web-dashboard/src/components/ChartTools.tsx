import React from 'react';
import RangeSwitcher from './RangeSwitcher';
import { AppState } from '../redux/store';
import ResetButton from './buttons/ResetButton';
import ScreenshotButton from './buttons/ScreenshotButton';
import DownloadButton from './buttons/DownloadButton';
import FullscreenButton from './buttons/FullscreenButton';
import { useSelector } from 'react-redux';

const ChartTools: React.FC = () => {
    const stockData = useSelector((state: AppState) => state.stockData);

    return (
        <div className="flex justify-between">
             <div className="flex-1">
                <RangeSwitcher />
            </div>

            <div>
                {/* <ToolButton
                    icon={<VscAdd />}
                    onClick={() => {}}
                    tooltip="Add indicator"
                /> */}

                <ResetButton />
                <ScreenshotButton elementId="chart-screenshot" />
                <DownloadButton
                    elementId="chart-screenshot"
                    filename={`${stockData.symbol}`}
                />
                <FullscreenButton elementId="chart-fullscreen" />
            </div>
        </div>
    );
};

export default ChartTools;
