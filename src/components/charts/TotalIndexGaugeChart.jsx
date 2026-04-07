import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const TotalIndexGaugeChart = ({ session }) => {
    const value = session?.totalIndex || 0;
    
    let color;
    if (value < 30) color = '#22c55e';
    else if (value < 60) color = '#eab308';
    else if (value < 80) color = '#f97316';
    else color = '#ef4444';
    
    let label;
    if (value < 30) label = 'Отлично';
    else if (value < 60) label = 'Норма';
    else if (value < 80) label = 'Повышена';
    else label = 'Критическая';
    
    const chartData = {
        datasets: [{
            data: [value, 100 - value],
            backgroundColor: [color, '#e5e7eb'],
            borderWidth: 0,
            cutout: '70%',
        }]
    };

    const options = {
        responsive: true,
        plugins: { tooltip: { enabled: false }, legend: { display: false } }
    };

    return (
        <div style={{ position: 'relative', width: 200, margin: '0 auto' }}>
            <Doughnut data={chartData} options={options} />
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: 28, fontWeight: 'bold' }}>{value}%</div>
                <div style={{ fontSize: 12, color: color }}>{label}</div>
            </div>
        </div>
    );
};

export default TotalIndexGaugeChart;