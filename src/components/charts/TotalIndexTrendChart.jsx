import React from 'react';
import { Line } from 'react-chartjs-2';

const TotalIndexTrendChart = ({ sessions }) => {
    const chartData = {
        labels: sessions.map(s => `${s.date} (${s.timeOfDay})`),
        datasets: [
            {
                label: 'Общий индекс состояния',
                data: sessions.map(s => s.totalIndex || 0),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                tension: 0.3,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 8,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { callbacks: { label: (ctx) => `Общий индекс: ${ctx.raw}%` } }
        },
        scales: {
            y: { 
                beginAtZero: true, 
                max: 100, 
                title: { display: true, text: 'Общий индекс (%)' },
                ticks: { callback: value => value + '%' }
            },
            x: { title: { display: true, text: 'Дата и время сессии' } }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default TotalIndexTrendChart;