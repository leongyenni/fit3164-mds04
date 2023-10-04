import React from 'react';
import StockDataItem from './StockDataItem';

const StockDataContainer: React.FC = () => {
    return (
        <div className="grid-container flex overflow-x-auto mt-3">
            <StockDataItem symbol="AAPL" />
            <StockDataItem symbol="TSLA" />
            <StockDataItem symbol="META" />
            <StockDataItem symbol="MSFT" />
            <StockDataItem symbol="GOOG" />
            <StockDataItem symbol="AMZN" />
            <StockDataItem symbol="NKE" />
            <StockDataItem symbol="DIS" />
            <StockDataItem symbol="GRAB" />
        </div>
    );
};

export default StockDataContainer;
