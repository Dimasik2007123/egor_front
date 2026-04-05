import React from 'react';
import { Line } from 'react-chartjs-2';

const FatigueChart = ({ data }) => {
    if (!data || !data.labels || !data.values) {
        return <div>Нет данных для отображения</div>;
    }

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Усталость',
                data: data.values,
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(239, 68, 68)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
            duration: 1500,
            easing: 'easeOutCubic'
        },
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: '#e2e8f0',
                borderColor: '#ef4444',
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        return `Усталость: ${context.raw}%`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: { display: true, text: 'Уровень усталости (%)', color: '#475569' },
                grid: { color: '#e2e8f0' },
                ticks: { callback: value => value + '%', color: '#475569' }
            },
            x: {
                title: { display: true, text: 'Время', color: '#475569' },
                grid: { display: false },
                ticks: { color: '#475569' }
            }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default FatigueChart;