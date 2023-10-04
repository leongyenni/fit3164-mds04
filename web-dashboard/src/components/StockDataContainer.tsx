import React from 'react';
import StockDataItem from './StockDataItem';

const symbols = [
    'AAPL',
    'TSLA',
    'META',
    'MSFT',
    'GOOG',
    'AMZN',
    'NKE',
    'DIS',
    'GRAB'
];

const StockDataContainer: React.FC = () => {
    return (
        <div className="grid-container flex overflow-x-auto mt-3">
            {symbols.map((symbol, index) => (
                <StockDataItem key={index} symbol={symbol} />
            ))}
        </div>
    );
};

export default StockDataContainer;
