import React from 'react';
import { useDispatch } from 'react-redux';
import { setTimeRange } from '../redux/timeRangeSlice';

const RangeSwitcher: React.FC = () => {
    const dispatch = useDispatch();

    return (
        <div className="inline-flex">
            <button
                className=" hover:bg-gray-800 text-lg text-white py-1 px-3 mx-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:font-medium focus:text-blue-400 focus:font-extrabold focus:underline underline-offset-8"
                onClick={() =>
                    dispatch(
                        setTimeRange({ timeRange: '1d', timeInterval: '5m' })
                    )
                }
            >
                1d
            </button>
            <button
                className=" hover:bg-gray-800 text-lg text-white py-1 px-3 mx-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:font-medium focus:text-blue-400 focus:font-extrabold focus:underline underline-offset-8"
                onClick={() =>
                    dispatch(
                        setTimeRange({ timeRange: '1wk', timeInterval: '1h' })
                    )
                }
            >
                1w
            </button>
            <button
                className=" hover:bg-gray-800 text-lg text-white py-1 px-3 mx-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:font-medium focus:text-blue-400 focus:font-extrabold focus:underline underline-offset-8"
                onClick={() =>
                    dispatch(
                        setTimeRange({ timeRange: '1mo', timeInterval: '1d' })
                    )
                }
            >
                1mo
            </button>
            <button
                className=" hover:bg-gray-800 text-lg text-white py-1 px-3 mx-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:font-medium focus:text-blue-400 focus:font-extrabold focus:underline underline-offset-8"
                onClick={() =>
                    dispatch(
                        setTimeRange({ timeRange: '3mo', timeInterval: '1d' })
                    )
                }
            >
                3mo
            </button>
            <button
                className=" hover:bg-gray-800 text-lg text-white py-1 px-3 mx-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:font-medium focus:text-blue-400 focus:font-extrabold focus:underline underline-offset-8"
                onClick={() =>
                    dispatch(
                        setTimeRange({ timeRange: '6mo', timeInterval: '1d' })
                    )
                }
            >
                6mo
            </button>
            <button
                className=" hover:bg-gray-800 text-lg text-white py-1 px-3 mx-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:font-medium focus:text-blue-500 focus:font-bold focus:underline underline-offset-8"
                onClick={() =>
                    dispatch(
                        setTimeRange({ timeRange: '1y', timeInterval: '1d' })
                    )
                }
            >
                1y
            </button>
        </div>
    );
};

export default RangeSwitcher;
