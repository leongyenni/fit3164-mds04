import React from 'react';
import { VscRefresh } from 'react-icons/vsc';
import { CiCamera } from 'react-icons/ci';
import { PiCopyThin, PiDownloadSimpleThin } from 'react-icons/pi';
import { BsFullscreen } from 'react-icons/bs';

const ChartTools: React.FC = () => {
    return (
        <div className="text-white inline-block ">
            <span className="inline-block text-2xl align-middle mx-2">
                <VscRefresh />
            </span>

            <span className="inline-block text-2xl align-middle mx-2">
                <CiCamera />
            </span>

            <span className="inline-block text-lg align-middle mx-2">
                <BsFullscreen />
            </span>
        </div>
    );
};

// reset
// screenshot
// save or download
// fullscreen

export default ChartTools;
