import React from 'react';
import { ToolButtonProps } from '../types/ComponentTypes';

const ToolButton: React.FC<ToolButtonProps> = ({ icon, onClick, tooltip }) => {
    return (
        <span className="inline-block text-xl align-middle m-1 mb-0 px-2 py-1 pb-0  rounded-sm transition duration-300 ease-in-out transform hover:bg-gray-800">
            <button
                className="transition duration-300 ease-in-out transform hover:scale-105 hover:text-gray-200"
                onClick={onClick}
            >
                {icon}
            </button>
        </span>
    );
};

export default ToolButton;
