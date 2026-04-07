import React from 'react';
import { Bar } from 'react-chartjs-2';

const ObjectiveCognitiveBarChart = ({ sessions }) => {
    const chartData = {
        labels: sessions.map(s => `${s.date} (${s.timeOfDay})`),
        datasets: [
            {
                label: 'Когнитивная',
                data: sessions.map(s => s.objectiveCognitive || 0),
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderRadius: 8,
            },
            {
                label: 'Физиологическая',
                data: sessions.map(s => s.objectivePhysiological || 0),
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderRadius: 8,
            },
            {
                label: 'Психологическая',
                data: sessions.map(s => s.objectivePsychological || 0),
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderRadius: 8,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%` } }
        },
        scales: {
            y: { 
                beginAtZero: true, 
                max: 100, 
                title: { display: true, text: 'Оценка (%)' },
                ticks: { callback: value => value + '%' }
            },
            x: { title: { display: true, text: 'Дата и время сессии' } }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default ObjectiveCognitiveBarChart;