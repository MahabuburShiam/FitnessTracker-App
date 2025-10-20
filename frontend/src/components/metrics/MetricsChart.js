import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MetricsChart = ({ metrics }) => {
  if (!metrics || metrics.length < 2) {
    return <p className="text-center text-gray-500">Log at least two days of metrics to see your progress chart.</p>;
  }

  // Reverse metrics to have dates in ascending order for the chart
  const sortedMetrics = [...metrics].reverse();

  const data = {
    labels: sortedMetrics.map(m => new Date(m.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight (kg)',
        data: sortedMetrics.map(m => m.weight),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Sleep (hours)',
        data: sortedMetrics.map(m => m.sleep),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y1',
      },
      {
        label: 'Mood (1-10)',
        data: sortedMetrics.map(m => m.mood),
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
        yAxisID: 'y1',
      },
      {
        label: 'Energy (1-10)',
        data: sortedMetrics.map(m => m.energy),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Weight (kg)' },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Hours / Rating (1-10)' },
        grid: { drawOnChartArea: false }, // only show the grid for the primary axis
      },
    },
  };

  return <Line options={options} data={data} />;
};

export default MetricsChart;