import React from 'react';
import { Line } from 'react-chartjs-2';

const FatigueModulesChart = ({ sessions }) => {
    const chartData = {
        labels: sessions.map(s => `${s.date} (${s.timeOfDay})`),
        datasets: [
            {
                label: 'Когнитивная усталость',
                data: sessions.map(s => s.totalCognitive || 0),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                borderWidth: 3,
                tension: 0.3,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: 'rgb(255, 99, 132)',
            },
            {
                label: 'Физиологическая усталость',
                data: sessions.map(s => s.totalPhysiological || 0),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderWidth: 3,
                tension: 0.3,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: 'rgb(54, 162, 235)',
            },
            {
                label: 'Психологическая усталость',
                data: sessions.map(s => s.totalPsychological || 0),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                borderWidth: 3,
                tension: 0.3,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: 'rgb(75, 192, 192)',
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
                title: { display: true, text: 'Уровень усталости (%)' },
                ticks: { callback: value => value + '%' }
            },
            x: { title: { display: true, text: 'Дата и время сессии' } }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default FatigueModulesChart;