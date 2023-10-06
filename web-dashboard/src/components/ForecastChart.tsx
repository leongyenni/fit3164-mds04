/* eslint-disable react-hooks/exhaustive-deps */
import { createChart, ColorType, AreaData } from 'lightweight-charts';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ForecastChartProps } from '../types/ComponentTypes';
import { color } from '../styles/colors';
import { currencyFormatter, OHLCFormatter } from '../utils/formattingUtils';
import { setForecastData } from '../redux/forecastDataSlice';
import SmallTooltip from './SmallTooltip';
import { UTCTimestamp } from '../types/DataTypes';

export const ForecastChart: React.FC<ForecastChartProps> = ({
    historicalData,
    forecastData,
    startForecast
}) => {
    const dispatch = useDispatch();

    const [tooltipVisible, setTooltipVisible] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (chart) {
                chart.applyOptions({
                    width:
                        document.getElementById('forecast-chart-div')!
                            .clientWidth * 0.95
                });
            }
        };

        const chart = createChart(
            document.getElementById('forecast-chart-div')!,
            {
                layout: {
                    background: {
                        type: ColorType.Solid,
                        color: 'transparent'
                    },
                    textColor: color.textColor
                },
                width:
                    document.getElementById('forecast-chart-div')!.clientWidth *
                    0.97,
                height: 475,
                timeScale: {
                    timeVisible: true,
                    secondsVisible: false,
                    borderVisible: false,
                    fixLeftEdge: true,
                    fixRightEdge: true
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
                },
                handleScale: {
                    mouseWheel: false,
                    pinch: false,
                    axisPressedMouseMove: false,
                    axisDoubleClickReset: false
                }
            }
        );

        const areaSeriesHist = chart.addAreaSeries({
            lineColor: color.areaLineColor,
            topColor: color.areaTopColor,
            bottomColor: color.areaBottomColor,
            lineWidth: 1
        });

        const areaSeriesForecast = chart.addAreaSeries({
            lineColor: '#ffffff',
            topColor: 'rgba(255, 255, 255, 0.45)',
            bottomColor: 'rgba(255, 255, 255, 0.1)',
            lineWidth: 1
        });

        const lastHistoricalDate = new Date(historicalData[historicalData.length - 1].date * 1000);
        const startForecastDateUTC = new Date(Date.UTC(lastHistoricalDate.getUTCFullYear(), lastHistoricalDate.getUTCMonth(), lastHistoricalDate.getUTCDate() + 1, 9, 30));
        let startForecastTimestamp = Math.floor(startForecastDateUTC.getTime() / 1000);
        
        const forecastWithTimestamps = forecastData.map((value, index) => {
            const currentTimestamp = startForecastTimestamp + index * 3600;
            return {
                date: currentTimestamp, 
                close: value
            };
        });
        
        areaSeriesHist.setData(
            historicalData.map((d) => {
                return {
                    time: d.date as UTCTimestamp,
                    value: d.close
                };
            })
        );

        chart.timeScale().fitContent();

        let currentIndex = 0;
        const lastIndex = forecastData.length;

        if (startForecast){
            areaSeriesForecast.update({
                time: historicalData[historicalData.length-1].date as UTCTimestamp,
                value: historicalData[historicalData.length-1].close as number
            });
        }
        
        const updateDataPoint = () => {
            if (currentIndex < lastIndex && startForecast) {
                const currentPoint = {
                    time: forecastWithTimestamps[currentIndex].date as UTCTimestamp,
                    value: forecastWithTimestamps[currentIndex].close as number
                };

                chart.timeScale().fitContent();
                areaSeriesForecast.update(currentPoint);
                currentIndex++;
            } else {
                clearInterval(intervalId);
            }
        };

        const intervalId = setInterval(updateDataPoint, 350);

        chart.subscribeCrosshairMove((param) => {
            if (
                param.point === undefined ||
                !param.time ||
                param.point.x < 0 ||
                param.point.x >
                    document.getElementById('forecast-chart-div')!
                        .clientWidth ||
                param.point.y < 0 ||
                param.point.y >
                    document.getElementById('forecast-chart-div')!.clientHeight
            ) {
                setTooltipVisible(false);
            } else {
                const toolTipMargin = 15;

                const areaData = param.seriesData.get(areaSeriesHist)
                    ? (param.seriesData.get(areaSeriesHist) as AreaData)
                    : (param.seriesData.get(areaSeriesForecast) as AreaData);

                const closePrice = areaData.value;

                const coordinate = areaSeriesHist.priceToCoordinate(closePrice)
                    ? areaSeriesHist.priceToCoordinate(closePrice)!
                    : areaSeriesForecast.priceToCoordinate(closePrice)!;

                const containerOffset =
                    document.getElementById('main-page')!.clientHeight -
                    document.getElementById('forecast-chart-div')!.clientHeight;

                const tooltipContent = {
                    timestamp: parseInt(areaData.time.toString()),
                    close: OHLCFormatter(areaData.value),
                    x: param.point.x - toolTipMargin,
                    y: containerOffset + coordinate - toolTipMargin
                };
                dispatch(setForecastData(tooltipContent));
                setTooltipVisible(true);
            }
        });

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            if (chart) {
                chart.remove();
            }
        };
    }, [startForecast]);

    return (
        <div>
            <div id="forecast-chart-div">
                {tooltipVisible && <SmallTooltip />}
            </div>
        </div>
    );
};
