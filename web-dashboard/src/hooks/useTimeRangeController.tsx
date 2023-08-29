// import { UTCTimestamp } from 'lightweight-charts';
// import React, { useState } from 'react';
// import { StockData } from '../DataType';

// const useTimeRangeController = (timeRange: string, data: StockData[]) => {
//     const [toTimestamp, setToTimestamp] = useState<number>(fromTimestamp);
//     const fromTimestamp: number = data[data.length - 1].date;

//     switch (timeRange) {
//         case '1d':
//             setToTimestamp(fromTimestamp - 24 * 60 * 60);
//             break;

//         case '1w':
//             setToTimestamp(fromTimestamp - 7 * 24 * 60 * 60);
//             break;

//         case '1m':
//             break;

//         case '3m':
//             break;

//         case '6m':
//             break;

//         case '1y':
//             break;

//         default:
//             break;
//     }

//     console.log(fromTimestamp);
//     return fromTimestamp;
// };

// export default useTimeRangeController;
