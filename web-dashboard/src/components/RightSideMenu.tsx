import React from 'react';
import { AiOutlineFundView } from 'react-icons/ai';
import { CiSquareMore } from 'react-icons/ci';
import {VscSymbolConstant} from 'react-icons/vsc';
import { PiTableThin } from 'react-icons/pi';
import { useDispatch } from 'react-redux';
import { VscRefresh } from 'react-icons/vsc';
import { CiCamera } from 'react-icons/ci';
import { PiCopyThin, PiDownloadSimpleThin } from 'react-icons/pi';
import { BsFullscreen } from 'react-icons/bs';
import { setChartState } from '../redux/chartSlice';
import { setTimeRange } from '../redux/timeRangeSlice';

const RightSideMenu: React.FC = () => {
    const dispatch = useDispatch();

    const handleReset = () => {
        dispatch(
            setChartState({
                isReset: true
            })
        );
    };

    return (
        <div className="w-4 right-0 h-auto border-l-2 border-gray-800 p-2 mr-4">
            
            <PiTableThin className="text-3xl text-white " />

            
        </div>
    );
};

export default RightSideMenu;
