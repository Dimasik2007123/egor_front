import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const BrainWaveDistributionChart = ({ sessions }) => {
    if (!sessions || sessions.length === 0) {
        return <div className="text-center text-gray-500 py-8">Нет данных для отображения распределения мозговых волн</div>;
    }

    const lastSession = sessions[sessions.length - 1];

    const chartData = {
        labels: ['Alpha', 'Beta', 'Theta', 'SMR'],
        datasets: [
            {
                data: [
                    (lastSession?.alpha || 0) * 100,
                    (lastSession?.beta || 0) * 100,
                    (lastSession?.theta || 0) * 100,
                    (lastSession?.smr || 0) * 100
                ],
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
        plugins: {
            legend: { position: 'bottom', labels: { font: { size: 10 }, usePointStyle: true } },
            tooltip: { callbacks: { label: function(context) { return `${context.label}: ${context.raw.toFixed(2)}`; } } },
        },
    };

    return (
        <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

export default BrainWaveDistributionChart;