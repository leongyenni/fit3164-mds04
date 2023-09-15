import React, { useEffect, useState } from 'react';
import { AppState } from '../redux/store';
import { useSelector } from 'react-redux';

interface TooltipProps {
    posX: number;
}

const dateFormatter = (timestamp: number) => {
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    const date = new Date(timestamp * 1000);
    const year = date.getUTCFullYear();
    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const min = date.getUTCMinutes();

    const date_str = `${month} ${day}, ${year}`;
    const time_str = `${hour}:${min} `;

    return [date_str, time_str];
};

const Tooltip: React.FC<TooltipProps> = ({ posX }) => {
    const tooltipData = useSelector((state: AppState) => state.stockData);

    console.log(tooltipData);

    const date = dateFormatter(tooltipData.timestamp)[0];
    const time = dateFormatter(tooltipData.timestamp)[1];

    const close = tooltipData.close;

    
    return (
        <div
            className="w-40 h-3/4 absolute p-3  box-border text-base text-left z-10 pointer-events-none rounded-tl-4 
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
