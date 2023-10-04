import React from 'react';
import { AiOutlineFundView } from 'react-icons/ai';
import { CiSquareMore } from 'react-icons/ci';
import {VscSymbolConstant} from 'react-icons/vsc';
import { PiTableThin } from 'react-icons/pi'

const RightSideMenu: React.FC = () => {
    return (
        <div className="w-4 right-0 h-auto border-l-2 border-gray-800 p-2 mr-4">
            <PiTableThin className="text-3xl text-white " />
        </div>
    );
};

export default RightSideMenu;
