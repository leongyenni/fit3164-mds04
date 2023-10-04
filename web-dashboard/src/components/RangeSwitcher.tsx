import React from 'react';
import { useDispatch } from 'react-redux';
import { setTimeRange } from '../redux/timeRangeSlice';

const timeRanges = [
    { label: '1d', range: '1d', interval: '5m' },
    { label: '1w', range: '1wk', interval: '30m' },
    { label: '1mo', range: '1mo', interval: '1d' },
    { label: '3mo', range: '3mo', interval: '1d' },
    { label: '6mo', range: '6mo', interval: '1d' },
    { label: '1y', range: '1y', interval: '1d' }
];

const RangeSwitcher: React.FC = () => {
    const dispatch = useDispatch();

    const handleTimeRangeClick = (range: string, interval: string) => {
        dispatch(setTimeRange({ timeRange: range, timeInterval: interval }));
    };

    return (
        <div className="inline-flex">
            {timeRanges.map((item, index) => (
                <button
                    key={index}
                    className=" text-white text-base px-2 py-1 mr-2 my-1 rounded-sm transition duration-300 ease-in-out transform hover:scale-105 hover:font-medium hover:bg-gray-800 focus:text-blue-400 focus:font-extrabold focus:underline underline-offset-8"
                    onClick={() =>
                        handleTimeRangeClick(item.range, item.interval)
                    }
                >
                    {item.label}
                </button>
            ))}
            <div className="border-r-2 border-gray-800 mt-0" />
        </div>
    );
};

export default RangeSwitcher;
