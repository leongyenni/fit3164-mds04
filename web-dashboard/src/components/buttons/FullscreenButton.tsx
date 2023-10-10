import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setChartState } from '../../redux/chartSlice';
import { RxEnterFullScreen, RxExitFullScreen } from 'react-icons/rx';
import ToolButton from './ToolButton';
import { ButtonProps } from '../../types/ComponentTypes';

const FullscreenButton: React.FC<ButtonProps> = ({ elementId }) => {
    const dispatch = useDispatch();

    const handleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            dispatch(setChartState({ isFullscreen: true }));
        } else {
            // document.getElementById('chart-fullscreen')!.requestFullscreen();
            document.getElementById(elementId)!.requestFullscreen();
            dispatch(setChartState({ isFullscreen: true }));
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
                !document.fullscreenElement ? 'Fullscreen' : 'Exit Fullscreen'
            }
        />
    );
};

export default FullscreenButton;
