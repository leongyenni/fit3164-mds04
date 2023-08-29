import React from 'react';
import useFinanceAPI from '../hooks/useFinanceAPI';
import useTSFinanceAPI from '../hooks/useTSFinanceAPI';

const StockDataItem: React.FC<{ symbol: string }> = ({ symbol }) => {
    const { loading, error, data } = useFinanceAPI(symbol);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="grid-item">
            <h1>{symbol}</h1>

            {data ? (
                <ul>
                    <li key={data.date}>
                        Date: {data.date}, Open: {data.open}, High: {data.high},
                        Low: {data.low}, Close: {data.close}, Adj Close:{' '}
                        {data.adjClose}, Volume: {data.volume}
                    </li>
                </ul>
            ) : (
                <div>No data available</div>
            )}
        </div>
    );
};

export default StockDataItem;
