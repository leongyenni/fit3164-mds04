import React, { useEffect } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import RangeSwitcher from './RangeSwitcher';
import ToolButton from './ToolButton';
import { VscAdd } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import { VscRefresh } from 'react-icons/vsc';
import { CiCamera } from 'react-icons/ci';
import { PiDownloadSimpleThin } from 'react-icons/pi';
import { RxEnterFullScreen, RxExitFullScreen } from 'react-icons/rx';
import { AppState } from '../redux/store';
import { setChartState } from '../redux/chartSlice';
import { setToastState } from '../redux/toastSlice';
import { ChartToolsProps } from '../types/ComponentTypes';
import Toast from './Toast';

const ChartTools: React.FC<ChartToolsProps> = ({ statsData }) => {
    const dispatch = useDispatch();
    const chartState = useSelector((state: AppState) => state.chartState);
    const stockData = useSelector((state: AppState) => state.stockData);

    // const [toast, setToast] = useState({ showToast: false, toastMessage: '' });

    const handleAddIndicator = () => {};

    const handleReset = () => {
        dispatch(setChartState({ isReset: true }));
    };

    const handleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            dispatch(setChartState({ isFullscreen: true }));
        } else {
            document.getElementById('chart-fullscreen')!.requestFullscreen();
            dispatch(setChartState({ isFullscreen: true }));
        }
    };

    const handleScreenshot = async () => {
        try {
            const canvas = await html2canvas(
                document.getElementById('chart-screenshot')!
            );
            const dataUrl = canvas.toDataURL('image/png');

            // Create an img element to display the image
            const img = new Image();
            img.src = dataUrl;

            // Append the img element to the document
            document.body.appendChild(img);

            // Select the img element
            const range = document.createRange();
            range.selectNode(img);
            window.getSelection()!.removeAllRanges();
            window.getSelection()!.addRange(range);

            // Copy the selected image to the clipboard
            document.execCommand('copy');
            window.getSelection()!.removeAllRanges();

            // Remove the img element from the document (optional)
            document.body.removeChild(img);
            dispatch(
                setToastState({
                    showToast: true,
                    message: 'Chart screenshot copied to clipboard'
                })
            );
        } catch (error) {
            console.error('Error capturing or copying the screenshot:', error);
            dispatch(
                setToastState({
                    showToast: true,
                    message: 'Failed to capture and copy the screenshot.'
                })
            );
        }
    };

    const handleDownload = async () => {
        try {
            const chartElement = document.getElementById('chart-screenshot');
            if (!chartElement) {
                throw new Error('Chart element not found');
            }

            // Capture the screenshot as a canvas
            const canvas = await html2canvas(chartElement);

            // Convert the canvas to a Blob
            canvas.toBlob((blob) => {
                if (blob) {
                    // Create a file name for the screenshot
                    const fileName = `${stockData.symbol}.png`;

                    // Use FileSaver.js to save the blob as an image file
                    saveAs(blob, fileName);

                    dispatch(
                        setToastState({
                            showToast: true,
                            message: 'Image downloaded'
                        })
                    );
                } else {
                    dispatch(
                        setToastState({
                            showToast: true,
                            message: 'Failed to capture screenshot.'
                        })
                    );
                }
            }, 'image/png');
        } catch (error) {
            console.error('Error capturing or saving the screenshot:', error);
            dispatch(
                setToastState({
                    showToast: true,
                    message: 'Failed to capture and save the screenshot.'
                })
            );
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            dispatch(setChartState({ isFullscreen: false }));
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange
            );
        };
    }, []);

    return (
        <div className="flex justify-between">
            <div className="flex-1">
                <RangeSwitcher />
            </div>

            <div>
                <ToolButton
                    icon={<VscAdd />}
                    onClick={() => {}}
                    tooltip="Add indicator"
                />

                <ToolButton
                    icon={<VscRefresh />}
                    onClick={handleReset}
                    tooltip="Refresh"
                />

                <ToolButton
                    icon={<CiCamera />}
                    onClick={handleScreenshot}
                    tooltip="Screenshot"
                />

                <ToolButton
                    icon={<PiDownloadSimpleThin />}
                    onClick={handleDownload}
                    tooltip="Download"
                />

                <ToolButton
                    icon={
                        !document.fullscreenElement ? (
                            <RxEnterFullScreen />
                        ) : (
                            <RxExitFullScreen />
                        )
                    }
                    onClick={handleFullscreen}
                    tooltip={
                        !document.fullscreenElement 
                            ? 'Fullscreen'
                            : 'Exit Fullscreen'
                    }
                />
            </div>

            {/* 
            <div className="text-base text-slate-400 absolute px-2 py-1 top-1 right-8">
                Closed: {dateFormatter(statsData.closingTime)} (UTC - 4)
            </div> 
            */}
        </div>
    );
};

export default ChartTools;
