import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { AiOutlineSearch } from 'react-icons/ai';
import useStockTickerAPI from '../hooks/useStockTickerAPI';
import { TickerData } from '../types/DataTypes';
import { SearchBarProps } from '../types/ComponentTypes';
import SearchItem from './SearchItem';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';

const Searchbar: React.FC<SearchBarProps> = ({ className }) => {
    const [inputVal, setInputVal] = useState('');
    const [open, setOpen] = useState(false);
    const tickerSymbols: TickerData[] = useStockTickerAPI(inputVal);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    const handleChange = (inputVal: string) => {
        setOpen(true);
        setInputVal(inputVal);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tickerSymbols.length === 0) {
            // Prevent "Enter" key event when tickerSymbols.length is 0
            e.preventDefault();
        } else if (e.key === 'Enter') {
            // Handle "Enter" key event when tickerSymbols.length > 0
            const inputElement = e.target as HTMLInputElement;
            handleClickValue(inputElement.value.toUpperCase());
        }
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
                        className="search-bar-input w-full h-12 p-3 pl-[56px] bg-slate-800 rounded-lg focus:bg-slate-950"
                        value={inputVal}
                        onClick={(e) => {
                            const inputElement = e.target as HTMLInputElement;
                            handleChange(inputElement.value.toUpperCase());
                        }}
                        onChange={(e) => {
                            handleChange(e.target.value.toUpperCase());
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                const inputElement =
                                    e.target as HTMLInputElement;
                                handleClickValue(
                                    inputElement.value.toUpperCase()
                                );
                            }
                        }}
                    />
                </div>
                {open && (
                    <div
                        ref={dropdownRef}
                        className="search-bar absolute top-3 mt-12 w-3/5 max-h-[240px] z-50 bg-slate-950 overflow-y-scroll rounded-lg shadow-md shadow-zinc-950"
                    >
                        {tickerSymbols.length === 0 && inputVal.length > 1 ? (
                            <p className="text-white p-2">No results found.</p>
                        ) : (
                            <ul>
                                {tickerSymbols.map((tickerSymbol) => (
                                    <SearchItem
                                        key={tickerSymbol.symbol}
                                        tickerSymbol={tickerSymbol}
                                        onClick={handleClickValue}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </form>
    );
};

export default Searchbar;
