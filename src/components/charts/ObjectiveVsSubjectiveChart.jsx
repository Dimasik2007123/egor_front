import React from 'react';
import { Bar } from 'react-chartjs-2';

const ObjectiveVsSubjectiveChart = ({ session }) => {
    if (!session) return null;
    
    const chartData = {
        labels: ['Когнитивная', 'Физиологическая', 'Психологическая'],
        datasets: [
            {
                label: 'Объективная оценка',
                data: [
                    session.objectiveCognitive || 0,
                    session.objectivePhysiological || 0,
                    session.objectivePsychological || 0
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderRadius: 8,
            },
            {
                label: 'Субъективная оценка',
                data: [
                    session.subjectiveCognitive || 0,
                    session.subjectivePhysiological || 0,
                    session.subjectivePsychological || 0
                ],
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderRadius: 8,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%` } }
        },
        scales: {
            y: { 
                beginAtZero: true, 
                max: 100, 
                title: { display: true, text: 'Оценка (%)' },
                ticks: { callback: value => value + '%' }
            }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default ObjectiveVsSubjectiveChart;