import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from './store';

interface StockDataState {
    timestamp: number;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    colour: string;
}

const initialState: StockDataState = {
    timestamp: 0,
    open: '',
    high: '',
    low: '',
    close: '',
    volume: '',
    colour: 'red'
};

const stockDataSlice = createSlice({
    name: 'stock data',
    initialState,
    reducers: {
        setStockData: (state, action: PayloadAction<StockDataState>) => {
           
            return {
                ...action.payload
            };
        }
    }
});

export const { setStockData } = stockDataSlice.actions;

export default stockDataSlice.reducer;
