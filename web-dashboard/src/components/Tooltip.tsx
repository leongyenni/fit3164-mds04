import React from 'react';
import { AppState } from '../redux/store';
import { useSelector } from 'react-redux';
import { dateFormatter } from '../utils/formattingUtils';
import { TooltipProps } from '../types/MainPageTypes';

const Tooltip: React.FC<TooltipProps> = ({ posX }) => {
    const tooltipData = useSelector((state: AppState) => state.stockData);

    const date = dateFormatter(tooltipData.timestamp)[0];
    const time = dateFormatter(tooltipData.timestamp)[1];

    const close = tooltipData.close;
    
    return (
        <div
            className="w-40 h-5/6 absolute p-3  box-border text-base text-left z-10 pointer-events-none rounded-tl-4 
            rounded-tr-4 border-b-0 shadow-md antialiased bg-opacity-25 text-white bg-white text-md "
            style={{ left: posX - 40 }}
        >
            <p className="text-lg tracking-wide">{date}</p>
            <p className="text-md tracking-wide text-slate-300 font-mono">
                {time}
            </p>
            <p className="text-3xl tracking-wider font-black mt-2">
                {close}
                <span className="pl-2 text-lg font-thin">usd</span>
            </p>
        </div>
    );
};

export default Tooltip;
