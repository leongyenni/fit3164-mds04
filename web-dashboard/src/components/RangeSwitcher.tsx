import React from 'react';
import { RangeSwitcherProps } from '../types/LandingPageTypes';

const RangeSwitcher: React.FC<RangeSwitcherProps> = ({ range, onClick }) => {

    return (
        <div>
            
            <button
                className="border hover:bg-slate-800 text-white hover:font-bold text-base py-1 px-8 rounded-3xl transition duration-300 ease-in-out transform hover:scale-105"
                onClick={(e) => {
                    onClick();
                    e.preventDefault();
                }}
            >
                {range}
            </button>
        </div>
    );
};

export default RangeSwitcher;
