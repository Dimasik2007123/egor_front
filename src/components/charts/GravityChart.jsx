import React from 'react';
import { Line } from 'react-chartjs-2';

const GravityChart = ({ data }) => {
    if (!data || !data.labels || !data.values) {
        return <div>Нет данных для отображения</div>;
    }

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Gravity',
                data: data.values,
                borderColor: 'rgb(139, 92, 246)',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(139, 92, 246)',
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
                        return `Gravity: ${context.raw.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                title: { display: true, text: 'Gravity' },
                beginAtZero: true
            },
            x: { title: { display: true, text: 'Время' } }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default GravityChart;