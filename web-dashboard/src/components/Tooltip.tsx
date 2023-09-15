import React, { useEffect, useState } from 'react';
import { StockData } from '../DataType';
import { timeStamp } from 'console';

interface TooltipProps {
    content: string[];
    posX: number;
}

// const date = OHLCdata.time.toLocaleString();
// const open = OHLCdata.open.toFixed(2);
// const high = OHLCdata.high.toFixed(2);
// const low = OHLCdata.low.toFixed(2);
// const close = OHLCdata.close.toFixed(2);
// const volume = volumeData.value.toFixed(2);

const dateFormatter = (timestamp: string) => {
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
    const date = new Date(parseInt(timestamp, 10) * 1000);
    const year = date.getUTCFullYear();
    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();
    // return `${year}-${month}-${day}`;
    return `${month} ${day}, ${year}`;
};

const Tooltip: React.FC<TooltipProps> = ({ content, posX }) => {
    const symbol = content[0];
    const date = dateFormatter(content[1]);
    console.log(date);
    const open = content[2];
    const high = content[3];
    const low = content[4];
    const close = content[5];
    const volume = content[6].substring(0, 3) + 'K';

    return (
        <div
            className="w-36 h-3/4 absolute p-4  box-border text-base text-left z-10 pointer-events-none rounded-tl-4 
            rounded-tr-4 border-b-0 shadow-md antialiased bg-opacity-25 text-white bg-white text-md "
            style={{ left: posX - 30 }}
        >
            <p className="text-md tracking-wide">{date}</p>

            {/* <p className="text-slate-300 text-sm mt-3 tracking-wider">Close:</p> */}
            <p className="text-4xl tracking-wider font-black">{close}</p>

            {/* <p className="text-slate-300 text-sm mt-3 tracking-wider">Open:</p>
            <p className="text-2xl tracking-wider font-black">{open}</p>

            <p className="text-slate-300 text-sm mt-3 tracking-wider">High:</p>
            <p className="text-2xl tracking-wider font-black">{high}</p>

            <p className="text-slate-300 text-sm mt-3 tracking-wider">Low:</p>
            <p className="text-2xl tracking-wider font-black">{low}</p> */}
            {/* 
            <p className="text-slate-300 text-sm mt-3 tracking-wider">Close:</p>
            <p className="text-2xl tracking-wider font-black">{close}</p> */}

            {/* <p className="text-slate-300 text-sm mt-4 tracking-wider">
                Volume:
            </p>
            <p className="text-3xl tracking-wider font-black">{volume}</p> */}

            {/* <div className="flex flex-col">
                <div className="flex justify-between">
                    <p className="text-slate-300">Open:</p>
                    <p className="text-left">{open}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-slate-300">High:</p>
                    <p className="text-left">{high}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-slate-300">Low:</p>
                    <p className="text-left">{low}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-slate-300">Close:</p>
                    <p className="text-left">{close}</p>
                </div>

                <div className="flex justify-between">
                    <p className="text-slate-300">Volume:</p>
                    <p className="text-left">{volume}</p>
                </div>
            </div> */}
        </div>
    );
};

export default Tooltip;
