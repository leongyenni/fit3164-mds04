import React from 'react';
import RangeSwitcher from './RangeSwitcher';
import { VscAdd } from 'react-icons/vsc';

const ChartControls: React.FC = () => {
    return (
        <div className="relative">
            <hr className="border-t border-gray-800 " />
            <RangeSwitcher />

            <button
                className="text-white text-base px-2 py-1 mx-1 rounded-sm 
                transition duration-300 ease-in-out transform hover:scale-105 hover:font-medium hover:bg-gray-800 
                focus:text-blue-400 focus:font-extrabold focus:underline underline-offset-8 top-1 right-1"
            >
                <span className="inline-block px-2 align-middle text-sm ">
                    <VscAdd />
                </span>
                <span>Indicator</span>
            </button>

            <div className="text-base text-slate-500 absolute top-1 right-8">Closed:</div>
        </div>
    );
};

export default ChartControls;
