import React from 'react';
import { Line } from 'react-chartjs-2';

const FatigueChart = ({ data }) => {
    if (!data || !data.labels || !data.values) {
        return <div>Нет данных для отображения</div>;
    }

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Усталость',
                data: data.values,
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(239, 68, 68)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Усталость: ${context.raw}%`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: { display: true, text: 'Уровень усталости (%)' },
                ticks: { callback: value => value + '%' }
            },
            x: { title: { display: true, text: 'Время' } }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default FatigueChart;