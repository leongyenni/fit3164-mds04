import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChartState } from '../types/ReduxStoreTypes';

const initialState: ChartState = {
    isReset: false
};

const chartSlice = createSlice({
    name: 'chart status',
    initialState,
    reducers: {
        setChartState: (state, action: PayloadAction<ChartState>) => {
            return {
                ...state,
                ...action.payload
            };
        }
    }
});

export const { setChartState } = chartSlice.actions;

export default chartSlice.reducer;
