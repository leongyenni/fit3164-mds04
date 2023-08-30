import {
    createChart,
    ColorType,
    AreaData,
    UTCTimestamp,
    CrosshairMode
} from 'lightweight-charts';
import React, { use, useEffect, useState } from 'react';
import { StockData } from '../DataType';
import useTSFinanceAPI from '../hooks/useTSFinanceAPI';

interface ChartProps {
    data: StockData[];
    timeInterval: string;
}

export const Chart: React.FC<ChartProps> = ({ data, timeInterval }) => {
    // stockData = useTSFinanceAPI()
    // const [stockData, setStockData] = useState(data);

    const color = {
        backgroundColor: 'rgba(1, 10, 38, 1)',
        lineColor: '#2962FF',
        textColor: '#FFFFFF',
        areaTopColor: '#2962FF',
        areaBottomColor: 'rgb(1, 10, 38)',
        gridColor: 'rgba(197, 203, 206, 0.2)',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        upColor: 'rgba(38, 166, 154, 1)',
        downColor: 'rgba(239, 83, 80, 1)',
        upColorLight: 'rgba(38, 166, 154, 0.5)', // Adjust the alpha value (opacity)
        downColorLight: 'rgba(239, 83, 80, 0.5)'
    };

    const formatters = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format;

    useEffect(() => {
        // handleRangeButton;
        // setStockData(use);
        console.log('data change');
        console.log(data);
    }, [timeInterval]);

    useEffect(() => {
        const handleResize = () => {
            if (chart) {
                chart.applyOptions({
                    width: document.getElementById('chart-div')!.clientWidth
                });
            }
        };

        const chart = createChart(document.getElementById('chart-div')!, {
            layout: {
                background: {
                    type: ColorType.Solid,
                    color: color.backgroundColor
                },
                textColor: color.textColor
            },
            width: document.getElementById('chart-div')!.clientWidth,
            height: 500,
            timeScale: {
                timeVisible: timeInterval === '1d' ? false : true,
                secondsVisible: false,
                // borderColor: 'rgba(255, 255, 255, 0.8)',
                borderVisible: false
            },
            rightPriceScale: {
                // borderColor: 'rgba(255, 255, 255, 0.8)',
                borderVisible: false
            },
            localization: {
                priceFormatter: formatters
            },
            grid: {
                horzLines: {
                    color: color.gridColor
                },
                vertLines: {
                    color: color.gridColor
                }
            }
        });

        // const newSeries = chart.addAreaSeries({
        //     lineColor: color.lineColor,
        //     topColor: color.areaTopColor,
        //     bottomColor: color.areaBottomColor,
        //     lineWidth: 3
        // });

        const lineSeries = chart.addLineSeries({
            color: '#4B84ED',
            lineWidth: 1
        });

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: color.upColor,
            downColor: color.downColor,
            borderVisible: false,
            wickUpColor: color.upColor,
            wickDownColor: color.downColor
        });

        const volumeSeries = chart.addHistogramSeries({
            priceFormat: {
                type: 'volume'
            },
            priceScaleId: ''
        });

        // newSeries.setData(
        //     data.map((d) => {
        //         return { time: d.date as UTCTimestamp, value: d.close };
        //     })
        // );

        console.log(data);

        lineSeries.setData(
            data.map((d) => {
                return {
                    time: d.date,
                    value: d.adjClose
                };
            })
        );

        candlestickSeries.setData(
            data.map((d) => {
                return {
                    time: d.date,
                    open: d.open,
                    high: d.high,
                    low: d.low,
                    close: d.close
                };
            })
        );

        volumeSeries.setData(
            data.map((d, index) => {
                const prevDayVolume = index > 0 ? data[index - 1].volume : 0;
                const barColor =
                    d.volume > prevDayVolume
                        ? color.upColorLight
                        : color.downColorLight;

                return {
                    time: d.date,
                    value: d.volume,
                    color: barColor
                };
            })
        );

        // chart.timeScale().setVisibleRange({
        //     from: handleClickButton(timeRange, data[data.length - 1].date)!,
        //     to: data[data.length - 1].date
        // });

        chart.priceScale('').applyOptions({
            scaleMargins: {
                top: 0.9,
                bottom: 0
            }
        });

        chart.timeScale().fitContent();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            if (chart) {
                chart.remove();
            }
        };
    }, [data]);

    return <div />;
};
