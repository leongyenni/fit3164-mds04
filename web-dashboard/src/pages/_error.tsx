import React from 'react';
import Link from 'next/link';

const ErrorPage: React.FC = () => {
    return (
        <div className="h-screen flex flex-col justify-center items-center ">
            {/* <div className="text-4xl text-gray-600 mb-4 animation-fade-in">
                <RiStockLine />
            </div> */}
            <h1 className="text-4xl font-semibold text-gray-800 mb-2 animate-fade-in">
                404 - Page Not Found
            </h1>
            <p className="text-gray-600 text-lg mb-6 animate-fade-in">
                The page you are looking for does not exist or has been moved.
            </p>
            {/* <Link href="/">
                <a className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-lg transition duration-300 ease-in-out">
                    Go Back to Dashboard
                </a>
            </Link> */}
        </div>
    );
};

export default ErrorPage;
