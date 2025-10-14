import React, { useState, useEffect } from 'react';
import DailyLogForm from './DailyLogForm';
import DailyLogHistory from './DailyLogHistory';
import './DailyLogTracker.css';

const DailyLogTracker = ({ logs, onUpdate }) => {
  const [activeView, setActiveView] = useState('today');
  const [todayLog, setTodayLog] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Find today's log
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = logs.find(log => log.date === today);
    setTodayLog(todayEntry);
  }, [logs]);

  const handleLogUpdate = async () => {
    if (onUpdate) {
      await onUpdate();
    }
  };

  const calculateDailyProgress = () => {
    if (!todayLog) return { steps: 0, water: 0, calories: 0, workout: false };

    return {
      steps: Math.min((todayLog.steps / 10000) * 100, 100),
      water: Math.min((todayLog.waterIntake / 2.0) * 100, 100),
      calories: Math.min((todayLog.calories / 2500) * 100, 100),
      workout: todayLog.workoutDone || false
    };
  };

  const progress = calculateDailyProgress();

  return (
    <div className="daily-log-tracker">
      {/* Header with Quick Stats */}
      <div className="tracker-header">
        <h2>Daily Tracker</h2>
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${activeView === 'today' ? 'active' : ''}`}
            onClick={() => setActiveView('today')}
          >
            Today's Log
          </button>
          <button 
            className={`toggle-btn ${activeView === 'history' ? 'active' : ''}`}
            onClick={() => setActiveView('history')}
          >
            History
          </button>
        </div>
      </div>

      {/* Quick Progress Overview */}
      {activeView === 'today' && (
        <div className="progress-overview">
          <div className="progress-card">
            <div className="progress-icon">🚶</div>
            <div className="progress-info">
              <span className="progress-label">Steps</span>
              <span className="progress-value">{todayLog?.steps || 0} / 10,000</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill steps" 
                style={{ width: `${progress.steps}%` }}
              ></div>
            </div>
          </div>

          <div className="progress-card">
            <div className="progress-icon">💧</div>
            <div className="progress-info">
              <span className="progress-label">Water</span>
              <span className="progress-value">{todayLog?.waterIntake || 0}L / 2L</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill water" 
                style={{ width: `${progress.water}%` }}
              ></div>
            </div>
          </div>

          <div className="progress-card">
            <div className="progress-icon">🔥</div>
            <div className="progress-info">
              <span className="progress-label">Calories</span>
              <span className="progress-value">{todayLog?.calories || 0} / 2,500</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill calories" 
                style={{ width: `${progress.calories}%` }}
              ></div>
            </div>
          </div>

          <div className="progress-card">
            <div className="progress-icon">💪</div>
            <div className="progress-info">
              <span className="progress-label">Workout</span>
              <span className="progress-value">
                {todayLog?.workoutDone ? 'Completed' : 'Not Done'}
              </span>
            </div>
            <div className={`workout-status ${todayLog?.workoutDone ? 'completed' : 'pending'}`}>
              {todayLog?.workoutDone ? '✓' : '○'}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="tracker-content">
        {activeView === 'today' ? (
          <DailyLogForm 
            todayLog={todayLog} 
            onUpdate={handleLogUpdate}
            loading={loading}
          />
        ) : (
          <DailyLogHistory 
            logs={logs}
            onUpdate={handleLogUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default DailyLogTracker;