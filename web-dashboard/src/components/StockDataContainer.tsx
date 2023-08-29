import React from 'react';
import StockDataItem from './StockDataItem';

const StockDataContainer: React.FC = ()=> {
    return (
    <div className="grid-container">
    <StockDataItem symbol="AAPL"/>
    <StockDataItem symbol="TSLA"/>
    <StockDataItem symbol="META"/>
    <StockDataItem symbol="MSFT"/>
    </div>)
}

export default StockDataContainer;