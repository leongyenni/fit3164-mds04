import {
    createChart,
    ColorType,
    BarData,
    HistogramData
} from 'lightweight-charts';
import React, { useEffect, useState } from 'react';
import { StockData } from '../DataType';
import Tooltip from './Tooltip';

interface ChartProps {
    data: StockData[];
    timeInterval: string;
}

export const Chart: React.FC<ChartProps> = ({ data, timeInterval }) => {
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
        upColorLight: 'rgba(38, 166, 154, 0.5)',
        downColorLight: 'rgba(239, 83, 80, 0.5)',
        toolTipColor: 'rgba(255, 255, 255, 0.25)'
    };

    const formatters = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format;

    // Tooltip
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipContent, setTooltipContent] = useState(['']);
    const [tooltipX, setTooltipX] = useState(0);

    const hideTooltip = () => {
        setTooltipVisible(false);
    };

    const showTooltip = (content: string[], x: number) => {
        setTooltipContent(content);
        setTooltipX(x);
        setTooltipVisible(true);
    };

    // Chart component
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
            height: 490,
            timeScale: {
                timeVisible: timeInterval === '1d' ? false : true,
                secondsVisible: false,
                borderVisible: false
            },
            rightPriceScale: {
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
            },
            crosshair: {
                horzLine: {
                    visible: false,
                    labelVisible: false
                },
                vertLine: {
                    visible: true,
                    width: 1.5,
                    style: 3,
                    color: color.toolTipColor,
                    labelVisible: true
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

        chart.priceScale('').applyOptions({
            scaleMargins: {
                top: 0.9,
                bottom: 0
            }
        });

        chart.timeScale().fitContent();

        chart.subscribeCrosshairMove((param) => {
            if (
                param.point === undefined ||
                !param.time ||
                param.point.x < 0 ||
                param.point.x >
                    document.getElementById('chart-div')!.clientWidth ||
                param.point.y < 0 ||
                param.point.y >
                    document.getElementById('chart-div')!.clientHeight
            ) {
                hideTooltip();
            } else {
                const OHLCdata = param.seriesData.get(
                    candlestickSeries
                ) as BarData;
                const volumeData = param.seriesData.get(
                    volumeSeries
                ) as HistogramData;
                const symbol = data[0].symbol;

                const date = OHLCdata.time.toString();
                const open = OHLCdata.open.toFixed(2);
                const high = OHLCdata.high.toFixed(2);
                const low = OHLCdata.low.toFixed(2);
                const close = OHLCdata.close.toFixed(2);
                const volume = volumeData.value.toFixed(2);

                const content = [symbol, date, open, high, low, close, volume];

                showTooltip(content, param.point.x);
            }
        });

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            if (chart) {
                chart.remove();
            }
        };
    }, [data]);

    return (
        <div>
            <div id="chart-div">
                {tooltipVisible && (
                    <Tooltip content={tooltipContent} posX={tooltipX} />
                )}
            </div>
        </div>
    );
};
