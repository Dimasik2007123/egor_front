import React from 'react';
import { Radar } from 'react-chartjs-2';

const RadarPerformanceChart = ({ data }) => {
    if (!data || !data.concentration || !data.relax || !data.stress || !data.fatigue) {
        return <div>Нет данных для отображения</div>;
    }

    const chartData = {
        labels: ['Концентрация', 'Расслабление', 'Стресс', 'Усталость', 'Псих. усталость'],
        datasets: [
            {
                label: 'Текущие показатели',
                data: [data.concentration, data.relax, data.stress, data.fatigue, data.psychologicalFatigue],
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 3,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
                tension: 0.2,
                fill: true,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        animation: { duration: 1200, easing: 'easeInOutQuart' },
        plugins: {
            legend: { position: 'top' },
            tooltip: { callbacks: { label: function(context) { return `${context.label}: ${context.raw}%`; } } },
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: { stepSize: 20, callback: value => value + '%' },
                grid: { color: '#e2e8f0' },
                angleLines: { color: '#cbd5e1' },
            }
        }
    };

    return <Radar data={chartData} options={options} />;
};

export default RadarPerformanceChart;