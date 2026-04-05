import React from 'react';
import { Line } from 'react-chartjs-2';

const MultiAxisChart = ({ data }) => {
    if (!data) return <div>Нет данных</div>;

    const chartData = {
        labels: data.labels || ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [
            {
                label: 'Концентрация',
                data: data.concentration || [50, 55, 60, 65, 70, 75, 80, 85, 88, 90],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                yAxisID: 'y',
                fill: false,
            },
            {
                label: 'ЧСС',
                data: data.heartRate || [75, 74, 73, 72, 71, 70, 69, 68, 67, 66],
                borderColor: 'rgb(220, 38, 38)',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                yAxisID: 'y1',
                fill: false,
                borderDash: [5, 5],
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        animation: { duration: 1000, easing: 'easeOutQuad' },
        plugins: { legend: { position: 'top' } },
        scales: {
            y: { title: { display: true, text: 'Концентрация (%)' }, beginAtZero: true, max: 100, position: 'left', ticks: { callback: value => value + '%' } },
            y1: { title: { display: true, text: 'ЧСС (уд/мин)' }, beginAtZero: true, max: 100, position: 'right', grid: { drawOnChartArea: false }, ticks: { callback: value => value + ' уд' } },
            x: { title: { display: true, text: 'Время' } }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default MultiAxisChart;