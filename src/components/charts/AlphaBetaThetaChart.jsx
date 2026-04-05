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
                label: 'Alpha (расслабление)',
                data: data.alpha,
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgb(34, 197, 94)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
            },
            {
                label: 'Beta (активность)',
                data: data.beta,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
            },
            {
                label: 'Theta (дремота)',
                data: data.theta,
                borderColor: 'rgb(249, 115, 22)',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgb(249, 115, 22)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
            },
            {
                label: 'SMR (фокус)',
                data: data.smr,
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgb(168, 85, 247)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
        },
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: 'white',
                bodyColor: '#e2e8f0',
                borderColor: '#334155',
                borderWidth: 1,
                cornerRadius: 6,
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                title: { display: true, text: 'Амплитуда', color: '#475569' },
                grid: { color: '#e2e8f0' },
                ticks: { color: '#475569' }
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

export default AlphaBetaThetaChart;