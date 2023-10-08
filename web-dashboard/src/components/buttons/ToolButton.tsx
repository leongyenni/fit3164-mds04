import React, { useState } from 'react';
import { ToolButtonProps } from '../../types/ComponentTypes';

const ToolButton: React.FC<ToolButtonProps> = ({ icon, onClick, tooltip }) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);

    const handleMouseEnter = () => {
        setTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setTooltipVisible(false);
    };

    return (
        <div
            className="inline-block text-xl align-middle m-1 mb-0 px-2 py-1 pb-0 z-20 rounded-sm transition
             duration-300 ease-in-out transform hover:bg-gray-800"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {isTooltipVisible && (
                <div
                    className="absolute pointer-events-none tracking-widest left-1/2 transform -translate-x-1/2 
                    bg-gray-900 text-white text-sm px-2 py-1 rounded mt-2 opacity-70 w-auto font-extralight"
                    style={{ top: '2rem' }}
                >
                    {tooltip}
                </div>
            )}
            <button
                className="transition duration-300 ease-in-out transform hover:scale-110 hover:text-gray-200"
                onClick={onClick}
            >
                {icon}
            </button>
        </div>
    );
};

export default ToolButton;
