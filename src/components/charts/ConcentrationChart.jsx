import React from 'react';
import { Line } from 'react-chartjs-2';

const ConcentrationChart = ({ data }) => {
    if (!data || !data.labels || !data.values) {
        return <div>Нет данных для отображения</div>;
    }

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Концентрация',
                data: data.values,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: 'rgb(37, 99, 235)',
                pointHoverBorderColor: 'white',
                pointHoverBorderWidth: 2,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    color: '#1e293b',
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: '#e2e8f0',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        return `Концентрация: ${context.raw}%`;
                    }
                }
            },
            filler: {
                propagate: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Уровень концентрации (%)',
                    font: {
                        size: 12,
                        weight: 'bold'
                    },
                    color: '#475569'
                },
                grid: {
                    color: '#e2e8f0',
                    drawBorder: true,
                    drawOnChartArea: true,
                    drawTicks: true
                },
                ticks: {
                    stepSize: 20,
                    callback: function(value) {
                        return value + '%';
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Время',
                    font: {
                        size: 12,
                        weight: 'bold'
                    },
                    color: '#475569'
                },
                grid: {
                    display: false,
                    drawBorder: true,
                    drawOnChartArea: false
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    color: '#475569'
                }
            }
        },
        elements: {
            line: {
                borderJoin: 'round',
                borderCap: 'round'
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },
        hover: {
            mode: 'nearest',
            intersect: false
        }
    };

    return <Line data={chartData} options={options} />;
};

export default ConcentrationChart;