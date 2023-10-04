import React from 'react';
import { BiDetail } from 'react-icons/bi';
import { MdOutlineQueryStats } from 'react-icons/md';
import { AiOutlineFundView } from 'react-icons/ai';

const RightSideMenu: React.FC = () => {
    return (
        <div className="w-4 right-0 h-auto border-l-2 border-gray-800 p-4 ">
            <AiOutlineFundView className="text-3xl text-slate-400 " />
        </div>
    );
};

export default RightSideMenu;
