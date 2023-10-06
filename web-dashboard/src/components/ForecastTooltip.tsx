import React from 'react';
import { AppState } from '../redux/store';
import { useSelector } from 'react-redux';
import { dateFormatter } from '../utils/formattingUtils';

const ForecastTooltip: React.FC = () => {
    const tooltipData = useSelector((state: AppState) => state.forecastData);

    const date = dateFormatter(tooltipData.timestamp)[0];
    const time = dateFormatter(tooltipData.timestamp)[1];
    const close = tooltipData.close;
    const posX = tooltipData.x;
    const posY = tooltipData.y;

    return (
        <div
            className="absolute p-2 box-border text-left pointer-events-none rounded-md 
            shadow-md antialiased bg-opacity-50 text-white bg-black text-sm z-10"
            style={{ left: `${posX}px`, top: `${posY}px` }}
        >
            <p className="text-base tracking-wide text-slate-300 ">
                {time} <span className="pl-2"> {close} USD</span>
            </p>
        </div>
    );
};

export default ForecastTooltip;
