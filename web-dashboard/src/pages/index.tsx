'use client';
import React from 'react';
import SearchBar from '../components/SearchBar';
import StockDataContainer from '../components/StockDataContainer';

const StartPage: React.FC = () => {
    
    return (
        <div className="start-page container">
            <h1 className="title mt-4 cursor-default"> MDS04 </h1>
            <h2 className="subtitle cursor-default glow">TradeTrens $</h2>
            <p className="text cursor-default">
                Empowering your investments through data-driven insights
            </p>
            <p className="text cursor-default">and meta-learning technology</p>

            <SearchBar className="my-12 " />

            <p className="text small-text">Popular stocks in the market</p>
            <StockDataContainer />

            {/* Background */}
            <div id="shape-1"></div>
            <div id="shape-2"></div>
            <div id="shape-3"></div>
        </div>
    );
};

export default StartPage;
