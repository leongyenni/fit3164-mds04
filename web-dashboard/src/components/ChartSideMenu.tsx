import React from 'react';
import { PiTableThin } from 'react-icons/pi';

const ChartSideMenu: React.FC = () => {
    return (
        <div className="right-0 h-auto border-l-2 border-gray-800 px-4 ">
            <PiTableThin className="text-3xl text-white " />
        </div>
    );
};

export default ChartSideMenu;
