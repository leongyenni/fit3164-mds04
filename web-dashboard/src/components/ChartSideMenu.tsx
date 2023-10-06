import React, { useState } from 'react';
import { PiTableThin } from 'react-icons/pi';
import { useDispatch } from 'react-redux';
import { setChartState } from '../redux/chartSlice';

const ChartSideMenu: React.FC = () => {
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);

    const toggleStatsDataContainer = () => {
        setOpen(!open);
        dispatch(setChartState({ isSideContainerOpen: open }));
    };

    return (
        <div className="flex">
            <div className="right-0 h-auto border-l-2 border-gray-800 px-4 ">
                <PiTableThin
                    className="text-3xl text-white"
                    onClick={toggleStatsDataContainer}
                />
            </div>
            {open && <div className="h-auto bg-white w-60">container</div>}
        </div>
    );
};

export default ChartSideMenu;
