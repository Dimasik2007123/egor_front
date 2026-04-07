import React from 'react';
import { Line } from 'react-chartjs-2';

const EmotionalRawMetricsChart = ({ sessions }) => {
    const chartData = {
        labels: sessions.map(s => `${s.date} (${s.timeOfDay})`),
        datasets: [
            {
                label: 'Внимание',
                data: sessions.map(s => s.attention || 0),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                tension: 0.3,
            },
            {
                label: 'Когнитивная нагрузка',
                data: sessions.map(s => s.cognitiveLoad || 0),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2,
                tension: 0.3,
            },
            {
                label: 'Самоконтроль',
                data: sessions.map(s => s.selfControl || 0),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                tension: 0.3,
            },
            {
                label: 'Когнитивный контроль',
                data: sessions.map(s => s.cognitiveControl || 0),
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                borderWidth: 2,
                tension: 0.3,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            y: { 
                beginAtZero: true, 
                max: 100, 
                title: { display: true, text: 'Значение (%)' },
                ticks: { callback: value => value + '%' }
            },
            x: {
                title: { display: true, text: 'Дата и время сессии' }
            }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default EmotionalRawMetricsChart;