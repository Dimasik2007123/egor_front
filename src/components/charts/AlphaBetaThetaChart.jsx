import React from 'react';
import { Line } from 'react-chartjs-2';

const AlphaBetaThetaChart = ({ data }) => {
    if (!data || !data.labels || !data.alpha || !data.beta || !data.theta) {
        return <div>Нет данных для отображения</div>;
    }

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Alpha',
                data: data.alpha,
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: false,
                pointBackgroundColor: 'rgb(34, 197, 94)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 7,
            },
            {
                label: 'Beta',
                data: data.beta,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: false,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 7,
            },
            {
                label: 'Theta',
                data: data.theta,
                borderColor: 'rgb(249, 115, 22)',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: false,
                pointBackgroundColor: 'rgb(249, 115, 22)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 7,
            },
            {
                label: 'SMR',
                data: data.smr,
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: false,
                pointBackgroundColor: 'rgb(168, 85, 247)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 7,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                title: { display: true, text: 'Амплитуда' },
                grid: { color: '#e2e8f0' }
            },
            x: {
                title: { display: true, text: 'Время' },
                grid: { display: false }
            }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default AlphaBetaThetaChart;