import { configureStore } from '@reduxjs/toolkit';
import stockDataReducer from './stockDataSlice';
import { createWrapper } from 'next-redux-wrapper';
import timeRangeReducer from './timeRangeSlice';

const makeStore = () =>
    configureStore({
        reducer: {
            stockData: stockDataReducer,
            timeRangeData: timeRangeReducer
        }
    });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;

export const wrapper = createWrapper<AppStore>(makeStore);
