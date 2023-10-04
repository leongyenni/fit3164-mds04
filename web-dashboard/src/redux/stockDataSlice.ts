import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StockDataState } from '../types/ReduxStoreTypes';

const initialState: StockDataState = {
    timestamp: 0,
    symbol: '',
    open: '',
    high: '',
    low: '',
    close: '',
    volume: '',
    colour: 'red',
    x: 0
};

const stockDataSlice = createSlice({
    name: 'stock data',
    initialState,
    reducers: {
        setStockData: (state, action: PayloadAction<StockDataState>) => {
            return {
                ...state,
                ...action.payload
            };
        }
    }
});

export const { setStockData } = stockDataSlice.actions;

export default stockDataSlice.reducer;
