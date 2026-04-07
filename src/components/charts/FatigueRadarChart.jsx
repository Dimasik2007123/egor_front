import React from 'react';
import { Radar } from 'react-chartjs-2';

const FatigueRadarChart = ({ session }) => {
    const chartData = {
        labels: ['Когнитивная', 'Физиологическая', 'Психологическая', 'Общая'],
        datasets: [{
            label: 'Уровень усталости',
            data: [
                session?.totalCognitive || 0,
                session?.totalPhysiological || 0,
                session?.totalPsychological || 0,
                session?.totalIndex || 0
            ],
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(239, 68, 68)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(239, 68, 68)'
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}%` } }
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: { stepSize: 20, callback: value => value + '%' }
            }
        }
    };

    return <Radar data={chartData} options={options} />;
};

export default FatigueRadarChart;