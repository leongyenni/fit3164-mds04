import React from 'react';
import { useDispatch } from 'react-redux';
import { VscRefresh } from 'react-icons/vsc';
import { CiCamera } from 'react-icons/ci';
import { PiCopyThin, PiDownloadSimpleThin } from 'react-icons/pi';
import { BsFullscreen } from 'react-icons/bs';
import { setChartState } from '../redux/chartSlice';
import { setTimeRange } from '../redux/timeRangeSlice';

const ChartTools: React.FC = () => {
    const dispatch = useDispatch();

    const handleReset = () => {
        dispatch(
            setChartState({
                isReset: true
            })
        );
    };

    return (
        <div className="text-white inline-block cursor-pointer">
            <span
                className="inline-block text-2xl align-middle mx-1 p-2 rounded-sm 
                transition duration-300 ease-in-out transform hover:bg-gray-800"
                onClick={() => {
                    handleReset();
                }}
            >
                <VscRefresh
                    className="transition duration-300 ease-in-out transform 
                hover:scale-110 hover:text-gray-200"
                />
            </span>

            <span
                className="inline-block text-3xl align-middle mx-1 p-2 rounded-sm 
                transition duration-300 ease-in-out transform hover:bg-gray-800"
            >
                <CiCamera
                    className="transition duration-300 ease-in-out transform 
                hover:scale-110 hover:text-gray-200"
                />
            </span>

            <span
                className="inline-block text-lg align-middle mx-1 p-2 rounded-sm 
                transition duration-300 ease-in-out transform hover:bg-gray-800"
            >
                <BsFullscreen
                    className="transition duration-300 ease-in-out transform 
                hover:scale-110 hover:text-gray-200"
                />
            </span>
        </div>
    );
};

// reset
// screenshot
// save or download
// fullscreen

export default ChartTools;
