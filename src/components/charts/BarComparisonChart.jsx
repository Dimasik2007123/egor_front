import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarComparisonChart = ({ data }) => {
    if (!data) return <div>Нет данных</div>;

    const chartData = {
        labels: data.labels || ['Сессия 1', 'Сессия 2', 'Сессия 3', 'Сессия 4', 'Сессия 5'],
        datasets: [
            {
                label: 'Концентрация',
                data: data.concentration || [65, 70, 75, 80, 85],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderRadius: 12,
                borderSkipped: false,
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },
            {
                label: 'Расслабление',
                data: data.relax || [60, 65, 68, 72, 78],
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderRadius: 12,
                borderSkipped: false,
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },
            {
                label: 'Стресс',
                data: data.stress || [40, 35, 30, 25, 20],
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderRadius: 12,
                borderSkipped: false,
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
            duration: 1000,
            easing: 'easeOutCubic',
            onComplete: function() { console.log('Анимация завершена'); }
        },
        plugins: {
            legend: { position: 'top' },
            tooltip: { callbacks: { label: function(context) { return `${context.dataset.label}: ${context.raw}%`; } } },
        },
        scales: {
            y: { beginAtZero: true, max: 100, title: { display: true, text: 'Значение (%)' }, ticks: { callback: value => value + '%' } },
            x: { title: { display: true, text: 'Сессии' }, grid: { display: false } }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default BarComparisonChart;