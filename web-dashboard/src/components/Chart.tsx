import {
    createChart,
    ColorType,
    BarData,
    HistogramData
} from 'lightweight-charts';
import React, { useEffect, useState } from 'react';
import { StockData } from '../DataType';
import Tooltip from './Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { setStockData } from '../redux/stockDataSlice';
import { AppState } from '../redux/store';

interface ChartProps {
    data: StockData[];
    timeInterval: string;
}

const currencyFormatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
}).format;

const OHLCFormatter = (price: number) => {
    return price.toFixed(2);
};

const volumeFormatter = (volume: number) => {
    const volume_str = volume.toFixed(2);
    return volume_str.substring(0, volume_str.length - 3) + 'K';
};

export const Chart: React.FC<ChartProps> = ({ data, timeInterval }) => {
    const dispatch = useDispatch();

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
        toolTipColor: 'rgba(255, 255, 255, 0.5)'
    };

    const i = data.length - 1;
    const currentStockData = {
        timestamp: data[i].date,
        open: OHLCFormatter(data[i].open),
        high: OHLCFormatter(data[i].high),
        low: OHLCFormatter(data[i].low),
        close: OHLCFormatter(data[i].close),
        volume: volumeFormatter(data[i].volume),
        colour: data[i].close > data[i].open ? color.upColor : color.downColor
    };

    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipX, setTooltipX] = useState(0);

    const hideTooltip = () => {
        setTooltipVisible(false);
        dispatch(setStockData(currentStockData));
    };

    const showTooltip = (x: number) => {
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
                priceFormatter: currencyFormatter
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
                    width: 2,
                    style: 2
                },
                vertLine: {
                    width: 2,
                    style: 2,
                    color: color.toolTipColor
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

                // const date = OHLCdata.time.toString();
                // const open = OHLCdata.open.toFixed(2);
                // const high = OHLCdata.high.toFixed(2);
                // const low = OHLCdata.low.toFixed(2);
                // const close = OHLCdata.close.toFixed(2);
                // const volume =
                //     volumeData.value.toFixed(2).substring(0, 3) + 'K';

                // const content = [symbol, date, open, high, low, close, volume];

                // showTooltip(content, param.point.x);

                const tooltipContent = {
                    timestamp: parseInt(OHLCdata.time.toString()),
                    open: OHLCFormatter(OHLCdata.open),
                    high: OHLCFormatter(OHLCdata.high),
                    low: OHLCFormatter(OHLCdata.low),
                    close: OHLCFormatter(OHLCdata.close),
                    volume: volumeFormatter(volumeData.value),
                    colour:
                        OHLCdata.close > OHLCdata.open
                            ? color.upColor
                            : color.downColor
                };
                dispatch(setStockData(tooltipContent));
                showTooltip(param.point.x);
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
                {tooltipVisible && <Tooltip posX={tooltipX} />}
            </div>
        </div>
    );
};
