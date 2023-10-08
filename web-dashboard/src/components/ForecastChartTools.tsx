import React from 'react';
import RangeSwitcher from './RangeSwitcher';
import ToolButton from './buttons/ToolButton';
import { VscAdd } from 'react-icons/vsc';
import ResetButton from './buttons/ResetButton';
import ScreenshotButton from './buttons/ScreenshotButton';
import DownloadButton from './buttons/DownloadButton';
import FullscreenButton from './buttons/FullscreenButton';

const ForecastChartTools: React.FC = () => {
    return (
        <div className="flex justify-between">
            <div className="flex-1">
                <RangeSwitcher />
            </div>

            <div>
                <ToolButton
                    icon={<VscAdd />}
                    onClick={() => {}}
                    tooltip="Add indicator"
                />

                <ResetButton />
                <ScreenshotButton />
                <DownloadButton />
                <FullscreenButton />
            </div>
        </div>
    );
};

export default ForecastChartTools;
