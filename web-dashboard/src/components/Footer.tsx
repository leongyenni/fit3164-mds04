import React from 'react';
import Image from 'next/image';

const Footer: React.FC = () => {
    return (
        <footer>
            <div className="w-full max-w-screen-2xl mx-auto p-4 md:py-8 h-60 mt-20">
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-md text-gray-500 sm:text-center dark:text-gray-400">
                    © 2023 MDS04 Final Year Project.
                </span>
            </div>
        </footer>
    );
};

export default Footer;
