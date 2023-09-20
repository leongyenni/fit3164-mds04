import { createChart, ColorType, Time } from 'lightweight-charts';
import React, { useEffect, useState } from 'react';
import { ForecastChartProps } from '../types/MainPageTypes';
import { color } from '../styles/colors';
import { currencyFormatter } from '../utils/formattingUtils';

export const ForecastChart: React.FC<ForecastChartProps> = ({ historicalData, forecastData, startForecast }) => {
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
                        color: color.backgroundColor
                    },
                    textColor: color.textColor
                },
                width: document.getElementById('forecast-chart-div')!
                    .clientWidth,
                height: 500,
                timeScale: {
                    timeVisible: true,
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
                        labelVisible: false,
                        width: 2,
                        style: 2,
                        color: color.toolTipColor
                    }
                }
            }
        );

        const lineSeries = chart.addAreaSeries({
            lineColor: color.areaLineColor,
            topColor: color.areaTopColor,
            bottomColor: color.areaBottomColor,
            lineWidth: 1
        });


        // lineSeries.setData(
        //     historicalData.map((d) => {
        //         return {
        //             time: d.date,
        //             value: d.close
        //         }
        //     })
        // )

        let currentIndex = 0;
        const lastIndex = forecastData.length;
        
        // lineSeries.applyOptions({
        //     lineColor: '#ffffff'
        // })

        const updateDataPoint = () => {
            if (currentIndex < lastIndex && startForecast) {
                const currentPoint = {
                    time: forecastData[currentIndex].date,
                    value: forecastData[currentIndex].close
                };
                chart.timeScale().fitContent();
                lineSeries.update(currentPoint);
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
    }, [historicalData, forecastData, startForecast]);

    return <div></div>;
};
