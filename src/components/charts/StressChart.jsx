import React from 'react';
import { Line } from 'react-chartjs-2';

const StressChart = ({ data }) => {
    if (!data || !data.labels || !data.values) {
        return <div>Нет данных для отображения</div>;
    }

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Стресс',
                data: data.values,
                borderColor: 'rgb(220, 38, 38)',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(220, 38, 38)',
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
                        return `Стресс: ${context.raw}%`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: { display: true, text: 'Уровень стресса (%)' },
                ticks: { callback: value => value + '%' }
            },
            x: { title: { display: true, text: 'Время' } }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default StressChart;