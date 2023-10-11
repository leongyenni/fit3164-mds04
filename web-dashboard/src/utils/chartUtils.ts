import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';
import { StockData } from '../types/DataTypes';

export const getSMA: React.FC<{ data: number[]; period: number }> = ({
    data,
    period
}) => {
    const sma = [];
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            sma.push(NaN);
        } else {
            const sum = data
                .slice(i - period + 1, i + 1)
                .reduce((a, b) => a + b, 0);
            sma.push(sum / period);
        }
    }
    return sma;
};

export const getForecastDate = (historicalDate: number) => {
    const dateObj = new Date(historicalDate * 1000);

    if (dateObj.getUTCDay() === 5) {
        return (
            new Date(dateObj.getTime() + 3 * 24 * 60 * 60 * 1000).getTime() /
            1000
        );
    } else {
        return (
            new Date(dateObj.getTime() + 24 * 60 * 60 * 1000).getTime() / 1000
        );
    }
};

export const getForecastDate_WeekModel = (historicalDate: number): number[] => {
    const dateObj = new Date(historicalDate * 1000);  // Convert to milliseconds
    const resultDates: number[] = [];

    while (resultDates.length < 7) {
        dateObj.setDate(dateObj.getDate() + 1); // Increment by one day
        if (dateObj.getUTCDay() !== 6 && dateObj.getUTCDay() !== 0) {
            // If the date is not a Saturday (6) or a Sunday (0), add to result
            const unixTimestamp = Math.floor(dateObj.getTime() / 1000);
            resultDates.push(unixTimestamp);
        }
    }

    return resultDates;
};


export const getHistoricalData = (
    historicalData: StockData[],
    marketState: string
): StockData[] => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const today = currentDate.getTime() / 1000;
    const tenDaysDate = today - 10 * 24 * 60 * 60;

    if (marketState === 'REGULAR') {
        const lastTenDaysData = historicalData.filter(
            (data) => data.date < today
        );
        return lastTenDaysData;
    } else {
        console.log(historicalData);

        const firstDate = new Date(historicalData[0].date * 1000);
        const startDate = new Date(firstDate);

        startDate.setDate(firstDate.getDate() + 1);
        startDate.setHours(0, 0, 0, 0);

        console.log(firstDate.getDate(), firstDate.getMonth());
        console.log(startDate.getDate(), startDate.getMonth());

        const startTimestamp = startDate.getTime() / 1000;

        console.log(firstDate);
        console.log(startDate);

        console.log(historicalData[0].date);
        console.log(startTimestamp);

        const firstTenDaysData = historicalData.filter(
            (data) => data.date > startTimestamp
        );

        console.log(firstTenDaysData);
        return firstTenDaysData;
    }
};
