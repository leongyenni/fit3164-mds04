import React from 'react';
import { useDispatch } from 'react-redux';
import { setChartState } from '../../redux/chartSlice';
import { VscRefresh } from 'react-icons/vsc';
import ToolButton from './ToolButton';

const ResetButton = () => {
    const dispatch = useDispatch();

    const handleReset = () => {
        dispatch(setChartState({ isReset: true }));
    };

    return (
        <ToolButton
            icon={<VscRefresh />}
            onClick={handleReset}
            tooltip="Reset"
        />
    );
};

export default ResetButton;
