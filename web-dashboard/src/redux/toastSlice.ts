import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastState } from '../types/ReduxStoreTypes';

const initialState: ToastState = {
    showToast: false,
    message: ''
};

const toastSlice = createSlice({
    name: 'chart status',
    initialState,
    reducers: {
        setToastState: (state, action: PayloadAction<ToastState>) => {
            return {
                ...state,
                ...action.payload
            };
        },
        resetToastState: () => {
            return {
                showToast: false,
                message: ''
            };
        }
    }
});

export const { setToastState, resetToastState } = toastSlice.actions;

export default toastSlice.reducer;
