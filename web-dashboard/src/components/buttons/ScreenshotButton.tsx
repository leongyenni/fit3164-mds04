import React from 'react';
import html2canvas from 'html2canvas';
import { CiCamera } from 'react-icons/ci';
import { setToastState } from '../../redux/toastSlice';
import { useDispatch } from 'react-redux';
import ToolButton from './ToolButton';

const ScreenshotButton: React.FC = () => {
    const dispatch = useDispatch();

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

    return (
        <ToolButton
            icon={<CiCamera />}
            onClick={handleScreenshot}
            tooltip="Screenshot"
        />
    );
};

export default ScreenshotButton;
