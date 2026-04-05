import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const BrainWaveDistributionChart = ({ data }) => {
    if (!data || !data.alpha || !data.beta || !data.theta || !data.smr) {
        return <div>Нет данных для отображения</div>;
    }

    const chartData = {
        labels: ['Alpha', 'Beta', 'Theta', 'SMR'],
        datasets: [
            {
                data: [data.alpha, data.beta, data.theta, data.smr],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                ],
                borderColor: 'white',
                borderWidth: 3,
                borderRadius: 10,
                spacing: 5,
                cutout: '60%',
                hoverOffset: 15,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 2000,
            easing: 'easeOutElastic',
        },
        plugins: {
            legend: { position: 'bottom', labels: { font: { size: 12 }, usePointStyle: true } },
            tooltip: { callbacks: { label: function(context) { return `${context.label}: ${context.raw.toFixed(2)}`; } } },
        },
    };

    return <Doughnut data={chartData} options={options} />;
};

export default BrainWaveDistributionChart;