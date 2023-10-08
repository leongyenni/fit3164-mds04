import React, { useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../redux/store';
import { resetToastState } from '../redux/toastSlice';

const Toast: React.FC = () => {
    const dispatch = useDispatch();
    const toastState = useSelector((state: AppState) => state.toastState);

    useEffect(() => {
        if (toastState.showToast) {
            const timeout = setTimeout(() => {
                dispatch(resetToastState());
            }, 5000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [toastState.showToast]);

    if (!toastState.showToast) {
        return null;
    }

    return (
        <div
            className="fixed z-20 tracking-wide bottom-4 left-1/2 transform -translate-x-1/2 flex items-center p-2 
        text-gray-500 bg-white rounded-md shadow dark:text-gray-400 dark:bg-gray-800 w-auto"
        >
            <div className="mx-2 text-sm font-normal flex-1">
                {toastState.message}
            </div>

            <button
                className="p-2 mr-1 rounded-md inline-flex items-center justify-center  
                dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 
                hover:bg-gray-100 bg-white text-gray-400 hover:text-gray-900 "
                onClick={() => dispatch(resetToastState())}
            >
                <AiOutlineClose />
            </button>
        </div>
    );
};

export default Toast;
