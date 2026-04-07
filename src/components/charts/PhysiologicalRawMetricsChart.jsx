import React from 'react';
import { Line } from 'react-chartjs-2';

const PhysiologicalRawMetricsChart = ({ sessions }) => {
    const chartData = {
        labels: sessions.map(s => `${s.date} (${s.timeOfDay})`),
        datasets: [
            {
                label: 'Стресс',
                data: sessions.map(s => s.stress || 0),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 3,
                tension: 0.3,
            },
            {
                label: 'Усталость',
                data: sessions.map(s => s.fatigue || 0),
                borderColor: 'rgb(234, 179, 8)',
                backgroundColor: 'rgba(234, 179, 8, 0.1)',
                borderWidth: 3,
                tension: 0.3,
            },
            {
                label: 'Концентрация',
                data: sessions.map(s => s.concentration || 0),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderWidth: 3,
                tension: 0.3,
            },
            {
                label: 'Расслабление',
                data: sessions.map(s => s.relax || 0),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
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

export default PhysiologicalRawMetricsChart;