import React from 'react';
import { Line } from 'react-chartjs-2';

const ProductivityChart = ({ sessions }) => {
    const chartData = {
        labels: sessions.map(s => `${s.date} (${s.timeOfDay})`),
        datasets: [
            {
                label: 'Продуктивность',
                data: sessions.map(s => s.productivity || 0),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                tension: 0.3,
                fill: true,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { callbacks: { label: (ctx) => `Продуктивность: ${ctx.raw}%` } }
        },
        scales: {
            y: { 
                beginAtZero: true, 
                max: 100, 
                title: { display: true, text: 'Продуктивность (%)' },
                ticks: { callback: value => value + '%' }
            },
            x: {
                title: { display: true, text: 'Дата и время сессии' }
            }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default ProductivityChart;