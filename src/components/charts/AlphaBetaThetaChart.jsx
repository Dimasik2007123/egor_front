import React from 'react';
import { Line } from 'react-chartjs-2';

const AlphaBetaThetaChart = ({ sessions }) => {
    if (!sessions || sessions.length === 0) {
        return <div className="text-center text-gray-500 py-8">Нет данных для отображения мозговой активности</div>;
    }

    const chartData = {
        labels: sessions.map(s => `${s.date} (${s.timeOfDay})`),
        datasets: [
            {
                label: 'Alpha (расслабление)',
                data: sessions.map(s => (s.alpha ?? 0) * 100),
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
                data: sessions.map(s => (s.beta ?? 0) * 100),
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
                data: sessions.map(s => (s.theta ?? 0) * 100),
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
                data: sessions.map(s => (s.smr ?? 0) * 100),
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
                title: { display: true, text: 'Дата и время сессии', color: '#475569' },
                grid: { display: false },
                ticks: { color: '#475569' }
            }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default AlphaBetaThetaChart;