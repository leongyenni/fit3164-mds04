import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { AiOutlineSearch } from 'react-icons/ai';
import useStockTickerAPI from '../hooks/useStockTickerAPI';
import { Ticker } from '../types/DataTypes';
import { SearchBarProps } from '../types/LandingPageTypes';

const Searchbar: React.FC<SearchBarProps> = ({ className }) => {
    const [inputVal, setInputVal] = useState('');
    const [open, setOpen] = useState(false);
    const tickerSymbols: Ticker[] = useStockTickerAPI(inputVal);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    const handleChange = (inputVal: string) => {
        setOpen(true);
        setInputVal(inputVal);
    };

    const handleClickValue = (tickerSymbol: string) => {
        setOpen(false);
        setInputVal(tickerSymbol);

        router.push({
            pathname: `/MainPage`,
            query: { tickerSymbol: tickerSymbol }
        });
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setOpen(false);
        }
    };

    useEffect(() => {
        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <form className="relative">
            <div className={`w-3/5 ${className}`}>
                <div className="relative">
                    <button className="absolute h-[48px] w-[48px] p-[15px] rounded-lg z-50">
                        <AiOutlineSearch className="text-xl text-gray-600" />
                    </button>
                    <input
                        type="search"
                        placeholder="Search..."
                        className="search-bar-input w-full h-12 p-3 pl-[56px] bg-slate-800 rounded-lg"
                        onClick={(e) => {
                            handleChange(e.target.value.toUpperCase());
                        }}
                        value={inputVal}
                        onChange={(e) => {
                            handleChange(e.target.value.toUpperCase());
                        }}
                        onKeyDown={(
                            e: React.KeyboardEvent<HTMLInputElement>
                        ) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleClickValue(e.target.value.toUpperCase());
                            }
                        }}
                    />
                </div>
                {open && (
                    <div
                        ref={dropdownRef}
                        className="absolute top-3 mt-12 w-3/5 max-h-[200px] z-50 bg-white overflow-y-scroll rounded-lg"
                    >
                        <ul>
                            {tickerSymbols.map((tickerSymbol) => (
                                <li
                                    className="search-bar-item text-slate-800 p-2"
                                    key={tickerSymbol.symbol}
                                    value={tickerSymbol.symbol}
                                    onClick={() => {
                                        handleClickValue(tickerSymbol.symbol);
                                    }}
                                >
                                    <div className="flex items-center">
                                        <span className="flex-grow font-medium">
                                            {tickerSymbol.symbol}
                                        </span>
                                        <span className="text-slate-500 tracking-wide font-thin text-left cursor-default">
                                            {tickerSymbol.company_name}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </form>
    );
};

export default Searchbar;
