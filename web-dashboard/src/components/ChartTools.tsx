import React, { useEffect } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import RangeSwitcher from './RangeSwitcher';
import ToolButton from './buttons/ToolButton';
import { VscAdd } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import { VscRefresh } from 'react-icons/vsc';
import { CiCamera } from 'react-icons/ci';
import { PiDownloadSimpleThin } from 'react-icons/pi';
import { RxEnterFullScreen, RxExitFullScreen } from 'react-icons/rx';
import { AppState } from '../redux/store';
import { setChartState } from '../redux/chartSlice';
import { setToastState } from '../redux/toastSlice';
import ResetButton from './buttons/ResetButton';
import ScreenshotButton from './buttons/ScreenshotButton';
import DownloadButton from './buttons/DownloadButton';
import FullscreenButton from './buttons/FullscreenButton';

const ChartTools: React.FC = () => {
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

export default ChartTools;
