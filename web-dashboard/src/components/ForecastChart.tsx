import { createChart, ColorType, Time } from 'lightweight-charts';
import React, { useEffect, useState } from 'react';
import { ForecastChartProps } from '../types/MainPageTypes';
import { color } from '../styles/colors';
import { currencyFormatter } from '../utils/formattingUtils';

export const ForecastChart: React.FC<ForecastChartProps> = ({
    historicalData,
    forecastData,
    startForecast
}) => {
    useEffect(() => {
        const handleResize = () => {
            if (chart) {
                chart.applyOptions({
                    width: document.getElementById('forecast-chart-div')!
                        .clientWidth
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
                width: document.getElementById('forecast-chart-div')!
                    .clientWidth * 0.97,
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

        areaSeriesHist.setData(
            historicalData.map((d) => {
                return {
                    time: d.date,
                    value: d.close
                };
            })
        );

        chart.timeScale().fitContent();
        console.log(chart
            .timeScale()
            .width()/2);

        let currentIndex = 0;
        const lastIndex = forecastData.length;

        const updateDataPoint = () => {
            if (currentIndex < lastIndex && startForecast) {
                const currentPoint = {
                    time: forecastData[currentIndex].date,
                    value: forecastData[currentIndex].close
                };
                console.log(forecastData[currentIndex].date);
                chart.timeScale().fitContent();
                areaSeriesForecast.update(currentPoint);
                currentIndex++;
            } else {
                clearInterval(intervalId);
            }
        };

        const intervalId = setInterval(updateDataPoint, 350);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            if (chart) {
                chart.remove();
            }
        };
    }, [startForecast]);

    return <div></div>;
};
