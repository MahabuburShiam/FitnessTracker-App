import React, { useState } from 'react';
import './DailyLogHistory.css';

const DailyLogHistory = ({ logs, onUpdate }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const getDateRange = () => {
    const today = new Date();
    const startDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(today.getMonth() - 3);
        break;
      default:
        startDate.setDate(today.getDate() - 7);
    }
    
    return { start: startDate, end: today };
  };

  const calculateStats = () => {
    const filteredLogs = logs.filter(log => {
      const logDate = new Date(log.date);
      const range = getDateRange();
      return logDate >= range.start && logDate <= range.end;
    });

    const stats = {
      totalDays: filteredLogs.length,
      averageSteps: 0,
      averageCalories: 0,
      averageWater: 0,
      workoutDays: 0,
      consistency: 0
    };

    if (filteredLogs.length > 0) {
      stats.averageSteps = Math.round(filteredLogs.reduce((sum, log) => sum + log.steps, 0) / filteredLogs.length);
      stats.averageCalories = Math.round(filteredLogs.reduce((sum, log) => sum + log.calories, 0) / filteredLogs.length);
      stats.averageWater = parseFloat((filteredLogs.reduce((sum, log) => sum + log.waterIntake, 0) / filteredLogs.length).toFixed(2));
      stats.workoutDays = filteredLogs.filter(log => log.workoutDone).length;
      stats.consistency = Math.round((filteredLogs.length / (selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 90)) * 100);
    }

    return stats;
  };

  const stats = calculateStats();

  const getMoodIcon = (mood) => {
    const moodIcons = {
      excellent: '😄',
      good: '😊',
      average: '😐',
      poor: '😔',
      terrible: '😢'
    };
    return moodIcons[mood] || '─';
  };

  const getActivityLevel = (steps) => {
    if (steps < 5000) return { level: 'Sedentary', color: '#ff6b6b' };
    if (steps < 7500) return { level: 'Light', color: '#feca57' };
    if (steps < 10000) return { level: 'Moderate', color: '#48dbfb' };
    if (steps < 12500) return { level: 'Active', color: '#1dd1a1' };
    return { level: 'Very Active', color: '#54a0ff' };
  };

  return (
    <div className="daily-log-history">
      {/* Period Selector */}
      <div className="history-header">
        <h3>Log History</h3>
        <div className="period-selector">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="3months">Last 3 Months</option>
          </select>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-value">{stats.totalDays}</div>
          <div className="stat-label">Days Logged</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.averageSteps.toLocaleString()}</div>
          <div className="stat-label">Avg Steps</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.averageWater}L</div>
          <div className="stat-label">Avg Water</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.workoutDays}</div>
          <div className="stat-label">Workout Days</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.consistency}%</div>
          <div className="stat-label">Consistency</div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="logs-table-container">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Steps</th>
              <th>Activity</th>
              <th>Calories</th>
              <th>Water</th>
              <th>Workout</th>
              <th>Mood</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {logs.slice(0, 20).map((log) => {
              const activity = getActivityLevel(log.steps);
              const dailyScore = log.dailyScore || 0;
              
              return (
                <tr key={log.id}>
                  <td className="date-cell">
                    {new Date(log.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td className="steps-cell">{log.steps.toLocaleString()}</td>
                  <td className="activity-cell">
                    <span 
                      className="activity-badge"
                      style={{ backgroundColor: activity.color }}
                    >
                      {activity.level}
                    </span>
                  </td>
                  <td className="calories-cell">{log.calories}</td>
                  <td className="water-cell">{log.waterIntake}L</td>
                  <td className="workout-cell">
                    <span className={`workout-indicator ${log.workoutDone ? 'completed' : 'skipped'}`}>
                      {log.workoutDone ? '✓' : '─'}
                    </span>
                  </td>
                  <td className="mood-cell">{getMoodIcon(log.mood)}</td>
                  <td className="score-cell">
                    <div className="score-bar">
                      <div 
                        className="score-fill"
                        style={{ width: `${dailyScore}%` }}
                      ></div>
                      <span className="score-text">{dailyScore}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {logs.length === 0 && (
          <div className="empty-state">
            <p>No logs found for the selected period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyLogHistory;