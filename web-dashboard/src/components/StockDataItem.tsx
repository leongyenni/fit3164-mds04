import React from 'react';
import useFinanceAPI from '../hooks/useFinanceAPI';
import { StockDataItemProps } from '../types/LandingPageTypes';
import { currencyFormatter } from '../utils/formattingUtils';

const StockDataItem: React.FC<StockDataItemProps> = ({ symbol }) => {
    const { loading, error, data } = useFinanceAPI(symbol);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    {/* Change all 200 belows to previous close price */}
    let difference = '0';
    let percentageDifference = '0';

    if (data) {
        difference = (data.close - 200).toFixed(2);
        percentageDifference = ((Number(difference) / 200) * 100).toFixed(2);
    }

    return (
        <div className="grid-item">
            <div className="text-2xl text-white font-bold opacity-1">{symbol}</div>
            <div>Company Name</div> {/* Modify this */}
            <br></br>

            {data ? (
                <ul>
                    {/* <li key={data.date}>
                        Date: {data.date}Open: {data.open}, High: {data.high},
                        Low: {data.low}, Close: {data.close}, Adj Close:{' '}
                        {data.adjClose}, Volume: {data.volume}
                    </li> */}
                    <li key={data.date}>
                        <div className="glow-text text-2xl font-bold text-white opacity-1">
                            {data.close.toFixed(2)} USD
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {200 < data.close ? (
                                <div style={{ display: 'flex', alignItems: 'center', paddingTop:'10px' }}>
                                    <img src="/images/stock-market-increase.png" alt="Stock Market Increase" style={{ paddingBottom: '3px', paddingLeft: '5px', paddingRight: '10px', height:'18px' }} />
                                    <div style={{ color: 'rgba(56, 220, 156)'}}>
                                        {difference}/{percentageDifference}%
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', paddingTop:'10px' }}>
                                    <img src="/images/stock-market-decrease.png" alt="Stock Market Decrease" style={{ paddingBottom: '3px', paddingLeft: '5px', paddingRight: '10px', height:'18px' }} />
                                    <div style={{ color: 'red'}}>
                                        {difference}/{percentageDifference}%
                                    </div>
                                </div>
                            )}
                        </div>
                    </li>
                </ul>
            ) : (
                <div>No data available</div>
            )}
        </div>
    );
};

export default StockDataItem;
