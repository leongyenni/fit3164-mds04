import React from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { PiDownloadSimpleThin } from 'react-icons/pi';
import { setToastState } from '../../redux/toastSlice';
import { useDispatch } from 'react-redux';
import ToolButton from './ToolButton';
import { DownloadButtonProps } from '../../types/ComponentTypes';

const DownloadButton: React.FC<DownloadButtonProps> = ({elementId, filename}) => {
    const dispatch = useDispatch();

    const handleDownload = async () => {
        try {
            // const chartElement = document.getElementById('chart-screenshot');
            const chartElement = document.getElementById(elementId);
            if (!chartElement) {
                throw new Error('Chart element not found');
            }

            // Capture the screenshot as a canvas
            const canvas = await html2canvas(chartElement);

            // Convert the canvas to a Blob
            canvas.toBlob((blob) => {
                if (blob) {
                    // Create a file name for the screenshot
                    const fileName = `${filename}.png`;

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

    return (
        <ToolButton
            icon={<PiDownloadSimpleThin />}
            onClick={handleDownload}
            tooltip="Download"
        />
    );
};

export default DownloadButton;
