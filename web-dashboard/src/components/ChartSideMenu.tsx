import React from 'react';
import { PiTableThin } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { setChartState } from '../redux/chartSlice';
import { AppState } from '../redux/store';
import StatsDataContainer from './StatsDataContainer';
import { ChartSideMenuProps } from '../types/ComponentTypes';

const ChartSideMenu: React.FC<ChartSideMenuProps> = ({ statsData }) => {
    const dispatch = useDispatch();
    const chartState = useSelector((state: AppState) => state.chartState);

    const toggleStatsDataContainer = () => {
        dispatch(
            setChartState({
                isSideContainerOpen: !chartState.isSideContainerOpen
            })
        );
    };

    console.log(chartState.isSideContainerOpen);

    return (
        <div className="flex w-auto">
            {chartState.isSideContainerOpen && (
                <StatsDataContainer statsData={statsData} />
            )}
            <div className="right-0 h-auto w-16 border-l-2 border-gray-800 px-4 ">
                <PiTableThin
                    className="text-3xl text-white cursor-pointer"
                    onClick={toggleStatsDataContainer}
                />
            </div>
        </div>
    );
};

export default ChartSideMenu;
