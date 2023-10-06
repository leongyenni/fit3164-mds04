import React from 'react';
import { PiTableThin } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { setChartState } from '../redux/chartSlice';
import { AppState } from '../redux/store';

const ChartSideMenu: React.FC = () => {
    const dispatch = useDispatch();
    const chartState = useSelector((state: AppState) => state.chartState);

    const toggleStatsDataContainer = () => {
        dispatch(
            setChartState({
                isSideContainerOpen: !chartState.isSideContainerOpen
            })
        );
    };

    return (
        <div className="flex">
            {chartState.isSideContainerOpen && (
                <div className="h-auto bg-white w-60 mr-2">container</div>
            )}
            <div className="right-0 h-auto border-l-2 border-gray-800 px-4 ">
                <PiTableThin
                    className="text-3xl text-white cursor-pointer"
                    onClick={toggleStatsDataContainer}
                />
            </div>
        </div>
    );
};

export default ChartSideMenu;
