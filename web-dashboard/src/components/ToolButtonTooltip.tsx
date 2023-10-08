import React, { useState } from 'react';
import { ToolButtonTooltipProps } from '../types/ComponentTypes';

const ToolButtonTooltip: React.FC<ToolButtonTooltipProps> = ({ tooltip }) => {
    return (
        <div
            className="absolute pointer-events-none tracking-wide left-1/2 transform -translate-x-1/2 
        bg-gray-900 text-white text-sm px-2 py-1 rounded mt-2 opacity-80 w-auto"
            style={{ top: '2rem' }}
        >
            {tooltip}
        </div>
    );
};

export default ToolButtonTooltip;
