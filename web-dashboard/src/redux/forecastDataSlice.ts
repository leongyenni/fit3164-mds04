import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ForecastDataState } from '../types/ReduxStoreTypes';

const initialState: ForecastDataState = {
    timestamp: 0,
    close: '',
    x: 0,
    y: 0
};

const forecastDataSlice = createSlice({
    name: 'forecast data',
    initialState,
    reducers: {
        setForecastData: (state, action: PayloadAction<ForecastDataState>) => {
            return {
                ...state,
                ...action.payload
            };
        }
    }
});

export const { setForecastData } = forecastDataSlice.actions;

export default forecastDataSlice.reducer;
