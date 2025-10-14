import React, { useState } from 'react';
import './SleepHistory.css';

const SleepHistory = ({ logs, onUpdate }) => {
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

  const getQualityColor = (quality) => {
    const colors = {
      excellent: '#00b894',
      good: '#00cec9',
      fair: '#fdcb6e',
      poor: '#e17055'
    };
    return colors[quality] || '#dfe6e9';
  };

  const getDurationAssessment = (duration) => {
    if (duration >= 7 && duration <= 9) return { status: 'optimal', label: 'Optimal' };
    if (duration >= 6 && duration < 7) return { status: 'adequate', label: 'Adequate' };
    if (duration > 9) return { status: 'excessive', label: 'Excessive' };
    return { status: 'insufficient', label: 'Insufficient' };
  };

  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    const range = getDateRange();
    return logDate >= range.start && logDate <= range.end;
  });

  return (
    <div className="sleep-history">
      {/* Header */}
      <div className="history-header">
        <h3>Sleep History</h3>
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

      {/* Stats Overview */}
      {filteredLogs.length > 0 && (
        <div className="sleep-stats">
          <div className="sleep-stat">
            <div className="stat-value">
              {filteredLogs.length}
            </div>
            <div className="stat-label">Nights Logged</div>
          </div>
          <div className="sleep-stat">
            <div className="stat-value">
              {(filteredLogs.reduce((sum, log) => sum + log.duration, 0) / filteredLogs.length).toFixed(1)}h
            </div>
            <div className="stat-label">Avg Duration</div>
          </div>
          <div className="sleep-stat">
            <div className="stat-value">
              {filteredLogs.filter(log => log.duration >= 7).length}
            </div>
            <div className="stat-label">Optimal Nights</div>
          </div>
          <div className="sleep-stat">
            <div className="stat-value">
              {Math.round((filteredLogs.filter(log => 
                ['good', 'excellent'].includes(log.quality)
              ).length / filteredLogs.length) * 100)}%
            </div>
            <div className="stat-label">Good Quality</div>
          </div>
        </div>
      )}

      {/* Sleep Logs */}
      <div className="sleep-logs-container">
        {filteredLogs.length > 0 ? (
          <div className="sleep-logs">
            {filteredLogs.map(log => {
              const durationAssessment = getDurationAssessment(log.duration);
              
              return (
                <div key={log.id} className="sleep-log-card">
                  <div className="log-date">
                    {new Date(log.date).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  
                  <div className="log-details">
                    <div className="duration-section">
                      <div className="duration-value">{log.duration}h</div>
                      <div className={`duration-status ${durationAssessment.status}`}>
                        {durationAssessment.label}
                      </div>
                    </div>
                    
                    <div className="quality-section">
                      <div 
                        className="quality-indicator"
                        style={{ backgroundColor: getQualityColor(log.quality) }}
                      ></div>
                      <span className="quality-label">{log.quality}</span>
                    </div>
                    
                    {log.bedtime && log.wakeTime && (
                      <div className="time-section">
                        <span>🛏️ {new Date(log.bedtime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <span>⏰ {new Date(log.wakeTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    )}
                    
                    {log.notes && (
                      <div className="notes-section">
                        <p>{log.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>No sleep logs found for the selected period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SleepHistory;