import {
    createChart,
    ColorType,
    AreaData,
    UTCTimestamp
} from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import { StockData } from '../DataType';

interface ChartProps {
    data: StockData[];
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
    timeRange: string;
}

export const ChartComponent: React.FC<ChartProps> = ({
    data,
    colors = {},
    timeRange
}) => {
    const {
        backgroundColor = '',
        lineColor = '#2962FF',
        textColor = 'white',
        areaTopColor = '#2962FF',
        areaBottomColor = 'rgb(1, 10, 38)'
    } = colors;

    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const [fromTimestamp, setFromTimestamp] = useState<UTCTimestamp>();

    const handleClickButton = (
        timeRange: string,
        toTimestamp: UTCTimestamp
    ) => {
        switch (timeRange) {
            case '1d':
                setFromTimestamp((toTimestamp - 24 * 60 * 60) as UTCTimestamp);

                console.log(toTimestamp);
                console.log(new Date(toTimestamp).toLocaleString());
                console.log(
                    new Date(toTimestamp - 24 * 60 * 60).toLocaleString()
                );
                break;

            case '1w':
                setFromTimestamp(
                    (toTimestamp - 7 * 24 * 60 * 60) as UTCTimestamp
                );
                break;

            case '1m':
                break;

            case '3m':
                break;

            case '6m':
                break;

            case '1y':
                break;

            default:
                break;
        }

        console.log(toTimestamp);
        return fromTimestamp;
    };

    useEffect(() => {
        const handleResize = () => {
            if (chart) {
                chart.applyOptions({
                    width: chartContainerRef.current!.clientWidth
                });
            }
        };

        const chart = createChart(chartContainerRef.current!, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor
            },
            width: chartContainerRef.current!.clientWidth,
            height: 300,
            timeScale: {
                timeVisible: true,
                secondsVisible: false
            }
        });

        const newSeries = chart.addAreaSeries({
            lineColor,
            topColor: areaTopColor,
            bottomColor: areaBottomColor
        });

        newSeries.setData(
            data.map((d) => {
                return { time: d.date as UTCTimestamp, value: d.close };
            })
        );

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350'
        });

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

        chart.timeScale().setVisibleRange({
            from: handleClickButton(timeRange, data[data.length - 1].date)!,
            to: data[data.length - 1].date
        });

        // chart.timeScale().fitContent();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            if (chart) {
                chart.remove();
            }
        };
    }, [data, timeRange]);

    return <div ref={chartContainerRef} />;
};
