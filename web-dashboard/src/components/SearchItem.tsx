import React from 'react';
import { SearchItemProps } from '../types/ComponentTypes';
import { color } from '../styles/colors';

const SearchItem: React.FC<SearchItemProps> = ({ tickerSymbol, onClick }) => {
    const handleItemClick = () => {
        onClick(tickerSymbol.symbol);
    };

    return (
        <li
            className="text-white p-2 hover:bg-slate-700 border-b border-slate-900 border-opacity-40"
            key={tickerSymbol.symbol}
            value={tickerSymbol.symbol}
            onClick={handleItemClick}
        >
            <div className="flex items-center">
                <span className="flex-grow font-medium">
                    <span>{tickerSymbol.symbol}</span> &#183;
                    <span className="text-slate-400 tracking-wide font-thin text-left cursor-default p-2">
                        {tickerSymbol.company_name}
                    </span>
                </span>
                <span
                    className="tracking-wide text-left px-1 rounded-md"
                    style={{
                        backgroundColor:
                            tickerSymbol.netchange > 0
                                ? color.upColorLight
                                : color.downColorLight,
                        color:
                            tickerSymbol.netchange > 0
                                ? color.upColor
                                : color.downColor
                    }}
                >
                    {tickerSymbol.netchange}
                    &nbsp;/&nbsp;
                    {tickerSymbol.pctchange}
                </span>
            </div>
        </li>
    );
};

export default SearchItem;
