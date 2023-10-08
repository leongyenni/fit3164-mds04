//getForecastDate

export const calculateSMA: React.FC<{ data: number[]; period: number }> = ({
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


