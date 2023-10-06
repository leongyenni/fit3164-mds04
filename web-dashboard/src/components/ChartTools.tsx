import React from 'react';
import RangeSwitcher from './RangeSwitcher';
import ToolButton from './ToolButton';
import { VscAdd } from 'react-icons/vsc';
import { CiSquareMore } from 'react-icons/ci';
import { VscSymbolConstant } from 'react-icons/vsc';
import { PiTableThin } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { VscRefresh } from 'react-icons/vsc';
import { CiCamera } from 'react-icons/ci';
import { PiCopyThin, PiDownloadSimpleThin } from 'react-icons/pi';
import { BsFullscreen } from 'react-icons/bs';
import { setChartState } from '../redux/chartSlice';
import { ChartControlsProps } from '../types/ComponentTypes';
import { AppState } from '../redux/store';

const ChartControls: React.FC<ChartControlsProps> = ({ statsData }) => {
     const dispatch = useDispatch();
    const chartState = useSelector((state: AppState) => state.chartState);

    const handleReset = () => {
        dispatch(setChartState({ isReset: true }));
    };

    const handleFullscreen = () => {
        dispatch(setChartState({ isFullscreen: true }));
    };

    // const handleScreenshot = () => {
    //     dispatch(setCh)
    // }

    return (
        <div className="flex justify-between">
            <div className="flex-1">
                <RangeSwitcher />
            </div>

            <div>
                <ToolButton
                    icon={<VscAdd />}
                    onClick={() => {}}
                    tooltip="Add"
                />

                <ToolButton
                    icon={<VscRefresh />}
                    onClick={handleReset}
                    tooltip="Refresh"
                />

                <ToolButton
                    icon={<CiCamera />}
                    onClick={() => {}}
                    tooltip="Screenshot"
                />

                <ToolButton
                    icon={<PiDownloadSimpleThin />}
                    onClick={() => {}}
                    tooltip="Download"
                />

                <ToolButton
                    icon={<BsFullscreen />}
                    onClick={handleFullscreen}
                    tooltip="Fullscreen"
                />
            </div>

            {/* 
            <div className="text-base text-slate-400 absolute px-2 py-1 top-1 right-8">
                Closed: {dateFormatter(statsData.closingTime)} (UTC - 4)
            </div> 
            */}
        </div>
    );
};

export default ChartControls;
