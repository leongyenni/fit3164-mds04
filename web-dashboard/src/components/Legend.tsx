import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';

const Label: React.FC = () => {
    const stockData = useSelector((state: AppState) => state.stockData);

    return (
        <span className="px-10 text-lg tracking-wider align-center">
            <span className="font-medium pl-3">O </span>
            <span
                style={{
                    color: stockData.colour
                }}
            >
                {stockData.open}
            </span>
            <span className="font-medium pl-3"> H </span>
            <span
                style={{
                    color: stockData.colour
                }}
            >
                {stockData.high}
            </span>
            <span className="font-medium pl-3"> L </span>
            <span
                style={{
                    color: stockData.colour
                }}
            >
                {stockData.low}
            </span>
            <span className="font-medium pl-3"> C </span>
            <span
                style={{
                    color: stockData.colour
                }}
            >
                {stockData.close}
            </span>
            <span className="font-medium pl-3"> V </span>
            <span
                style={{
                    color: stockData.colour
                }}
            >
                {stockData.volume}
            </span>
        </span>
    );
};

export default Label;
