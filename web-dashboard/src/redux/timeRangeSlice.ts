import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimeRangeState } from '../types/ReduxStoreTypes';

const initialState: TimeRangeState = {
    timeRange: '1y',
    timeInterval: '1d'
};

const timeRangeSlice = createSlice({
    name: 'time range',
    initialState,
    reducers: {
        setTimeRange: (state, action: PayloadAction<TimeRangeState>) => {
            return {
                ...state,
                ...action.payload
            };
        }
    }
});

export const { setTimeRange } = timeRangeSlice.actions;

export default timeRangeSlice.reducer;
