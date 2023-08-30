import React from 'react';

interface Props {
    range: string;
    onClick: () => void;
}

const RangeSwitcher: React.FC<Props> = ({ range, onClick }) => {
    return (
        <div>
            <button
                className="border hover:bg-slate-900 text-white hover:font-bold text-base py-1 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                onClick={onClick}
            >
                {range}
            </button>
        </div>
    );
};

export default RangeSwitcher;
