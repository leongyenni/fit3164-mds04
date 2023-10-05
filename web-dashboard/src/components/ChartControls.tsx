import React from 'react';
import RangeSwitcher from './RangeSwitcher';
import { VscAdd } from 'react-icons/vsc';
import { CiSquareMore } from 'react-icons/ci';
import { VscSymbolConstant } from 'react-icons/vsc';
import { PiTableThin } from 'react-icons/pi';
import { useDispatch } from 'react-redux';
import { VscRefresh } from 'react-icons/vsc';
import { CiCamera } from 'react-icons/ci';
import { PiCopyThin, PiDownloadSimpleThin } from 'react-icons/pi';
import { BsFullscreen } from 'react-icons/bs';
import { setChartState } from '../redux/chartSlice';
import { setTimeRange } from '../redux/timeRangeSlice';
import { ChartControlsProps } from '../types/ComponentTypes';
import { dateFormatter } from '../utils/formattingUtils';

const ChartControls: React.FC<ChartControlsProps> = ({ statsData }) => {
    const dispatch = useDispatch();

    const handleReset = () => {
        dispatch(
            setChartState({
                isReset: true
            })
        );
    };

    return (
        <div className="flex justify-between">
            

            <div className='flex-1'>
                <RangeSwitcher />
            </div>

            <div className='pr-8'>
                <span
                    className="inline-block text-xl align-middle mx-1 p-2 rounded-sm 
                transition duration-300 ease-in-out transform hover:bg-gray-800"
                >
                    <VscAdd
                        className="transition duration-300 ease-in-out transform 
                hover:scale-110 hover:text-gray-200"
                    />
                </span>

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

            {/* <div className="text-base text-slate-400 absolute px-2 py-1 top-1 right-8">
                Closed: {dateFormatter(statsData.closingTime)} (UTC - 4)
            </div> */}
        </div>
    );
};

export default ChartControls;
