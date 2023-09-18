// import {
//     createChart,
//     ColorType
// } from 'lightweight-charts';
// import React, { useEffect, useState } from 'react';

// import { ForecastChartProps } from '../types/MainPageTypes';

// export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
//     useEffect(() => {
//         const handleResize = () => {
//             if (chart) {
//                 chart.applyOptions({
//                     width: document.getElementById('chart-div')!.clientWidth
//                 });
//             }
//         };

//         const chart = createChart(document.getElementById('chart-div')!, {
//             layout: {
//                 background: {
//                     type: ColorType.Solid,
//                     color: color.backgroundColor
//                 },
//                 textColor: color.textColor
//             },
//             width: document.getElementById('chart-div')!.clientWidth,
//             height: 410,
//             timeScale: {
//                 timeVisible: timeInterval === '1d' ? false : true,
//                 secondsVisible: false,
//                 borderVisible: false
//             },
//             rightPriceScale: {
//                 borderVisible: false
//             },
//             localization: {
//                 priceFormatter: currencyFormatter
//             },
//             grid: {
//                 horzLines: {
//                     color: color.gridColor
//                 },
//                 vertLines: {
//                     color: color.gridColor
//                 }
//             },
//             crosshair: {
//                 horzLine: {
//                     width: 2,
//                     style: 2
//                 },
//                 vertLine: {
//                     labelVisible: false,
//                     width: 2,
//                     style: 2,
//                     color: color.toolTipColor
//                 }
//             }
//         });

//         // const newSeries = chart.addAreaSeries({
//         //     lineColor: color.lineColor,
//         //     topColor: color.areaTopColor,
//         //     bottomColor: color.areaBottomColor,
//         //     lineWidth: 3
//         // });

//         // newSeries.setData(
//         //     data.map((d) => {
//         //         return { time: d.date as UTCTimestamp, value: d.close };
//         //     })
//         // );

//         chart.timeScale().fitContent();

//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);

//             if (chart) {
//                 chart.remove();
//             }
//         };
//     }, [data]);

//     return <div></div>;
// };
