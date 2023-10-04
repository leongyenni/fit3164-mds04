import React from 'react';
import { useRouter } from 'next/router';
import Searchbar from './SearchBar';

const Header: React.FC = () => {
    const router = useRouter();
    
    const navigateToStartPage = () => {
        router.push({ pathname: '/' });
    };

    return (
        <div className="w-full relative">
            <div className="grid grid-flow-col-dense auto-cols-max grid-cols-[1fr,auto] my-6">
                <Searchbar />
                <p
                    className="text-3xl mr-6 cursor-pointer glow"
                    onClick={() => navigateToStartPage()}
                >
                    TradeTrens $ | MDS04
                </p>
            </div>
            <hr className="border-t border-gray-800 my-3" />
        </div>
    );
};

export default Header;
