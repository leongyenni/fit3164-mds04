import React from 'react';

interface Props {
    range: string;
    onClick: () => void;
}

const RangeSwitcher: React.FC<Props> = ({ range, onClick }) => {
    return (
        <div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={onClick}
            >
                {range}
            </button>
        </div>
    );
};

export default RangeSwitcher;
