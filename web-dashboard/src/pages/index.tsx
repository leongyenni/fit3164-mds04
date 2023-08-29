'use client';
import React from 'react';
import Link from 'next/link';
import '../styles/globals.css';
import SearchBar from '../components/SearchBar';
import StockDataContainer from '../components/StockDataContainer';

const StartPage: React.FC = () => {
    return (
        <div className="start-page">
            <h1 className="title"> MDS04 </h1>
            <h2 className="subtitle glow">TradeTrens $</h2>
            <p className="text">
                Empowering your investments through data-driven insights
            </p>
            <p className="text">and meta-learning technology</p>

            <SearchBar />
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
