import React from 'react';
import './ProgressCharts.css';

const ProgressCharts = ({ progress, onUpdate }) => {
  return (
    <div className="progress-charts">
      <h3>Progress Charts</h3>
      <div className="charts-grid">
        <div className="chart-card">
          <h4>Weight Progress</h4>
          {/* Chart implementation will go here */}
        </div>
        <div className="chart-card">
          <h4>Activity Progress</h4>
          {/* Chart implementation will go here */}
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;