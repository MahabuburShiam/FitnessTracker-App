import React from 'react';
import './StatsOverview.css';

const StatsOverview = ({ data, user, onRefresh }) => {
  const { stats, dailyLogs, workoutSessions, sleepLogs, progress } = data;

  const todayLog = dailyLogs[0] || {};
  const recentWorkout = workoutSessions[0] || {};
  const recentSleep = sleepLogs[0] || {};

  const calculateTodayCompletion = () => {
    let completed = 0;
    if (todayLog.calories > 0) completed++;
    if (todayLog.steps > 0) completed++;
    if (todayLog.waterIntake > 0) completed++;
    return Math.round((completed / 3) * 100);
  };

  const getSleepQuality = (quality) => {
    const qualityMap = {
      'excellent': { label: 'Excellent', color: '#00b894' },
      'good': { label: 'Good', color: '#00cec9' },
      'average': { label: 'Average', color: '#fdcb6e' },
      'poor': { label: 'Poor', color: '#e17055' },
      'terrible': { label: 'Terrible', color: '#d63031' }
    };
    return qualityMap[quality] || { label: 'Not recorded', color: '#b2bec3' };
  };

  return (
    <div className="stats-overview">
      {/* Main Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats?.totalSessions || 0}</span>
          <span className="stat-description">Workout Sessions</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats?.completedSessions || 0}</span>
          <span className="stat-description">Completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {stats?.totalDuration ? `${Math.round(stats.totalDuration / 60)}h` : '0h'}
          </span>
          <span className="stat-description">Total Duration</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats?.totalCalories || 0}</span>
          <span className="stat-description">Calories Burned</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats?.consistency || 0}%</span>
          <span className="stat-description">Consistency</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats?.averageMood || 0}</span>
          <span className="stat-description">Avg Mood</span>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="overview-grid">
        {/* Daily Log Summary */}
        <div className="overview-card">
          <div className="card-header">
            <h3 className="card-title">Today's Log</h3>
            <span className="card-icon">📝</span>
          </div>
          
          <div className="completion-progress">
            <div className="progress-header">
              <span>Daily Completion</span>
              <span>{calculateTodayCompletion()}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${calculateTodayCompletion()}%` }}
              ></div>
            </div>
          </div>

          <div className="today-stats">
            <div className="today-stat">
              <span className="today-label">Calories</span>
              <span className="today-value">{todayLog.calories || 0}</span>
            </div>
            <div className="today-stat">
              <span className="today-label">Steps</span>
              <span className="today-value">{todayLog.steps || 0}</span>
            </div>
            <div className="today-stat">
              <span className="today-label">Water</span>
              <span className="today-value">{todayLog.waterIntake || 0}L</span>
            </div>
          </div>
        </div>

        {/* Recent Workout */}
        <div className="overview-card">
          <div className="card-header">
            <h3 className="card-title">Recent Workout</h3>
            <span className="card-icon">💪</span>
          </div>
          
          {recentWorkout.id ? (
            <div className="workout-summary">
              <div className="workout-header">
                <h4>{recentWorkout.WorkoutSuggestion?.exerciseName || 'Custom Workout'}</h4>
                <span className={`status-badge ${recentWorkout.status}`}>
                  {recentWorkout.status}
                </span>
              </div>
              <div className="workout-details">
                {recentWorkout.duration && (
                  <span>Duration: {Math.round(recentWorkout.duration / 60)}min</span>
                )}
                {recentWorkout.caloriesBurned && (
                  <span>Calories: {recentWorkout.caloriesBurned}</span>
                )}
                {recentWorkout.mood && (
                  <span>Mood: {recentWorkout.mood}</span>
                )}
              </div>
              <p className="workout-notes">{recentWorkout.notes}</p>
            </div>
          ) : (
            <div className="empty-state">
              <p>No recent workouts</p>
              <button className="btn-primary">Start Workout</button>
            </div>
          )}
        </div>

        {/* Sleep Summary */}
        <div className="overview-card">
          <div className="card-header">
            <h3 className="card-title">Sleep Quality</h3>
            <span className="card-icon">😴</span>
          </div>
          
          {recentSleep.id ? (
            <div className="sleep-summary">
              <div className="sleep-quality">
                <div 
                  className="quality-indicator"
                  style={{ 
                    backgroundColor: getSleepQuality(recentSleep.quality).color 
                  }}
                ></div>
                <span className="quality-label">
                  {getSleepQuality(recentSleep.quality).label}
                </span>
              </div>
              <div className="sleep-details">
                <div className="sleep-time">
                  <span>Duration: {recentSleep.duration || '--'} hours</span>
                </div>
                <div className="sleep-period">
                  <span>Bed: {recentSleep.bedtime ? new Date(recentSleep.bedtime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--'}</span>
                  <span>Wake: {recentSleep.wakeTime ? new Date(recentSleep.wakeTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>No sleep data recorded</p>
              <button className="btn-primary">Log Sleep</button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="overview-card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
            <span className="card-icon">⚡</span>
          </div>
          
          <div className="quick-actions">
            <button className="quick-action-btn">
              <span className="action-icon">➕</span>
              <span className="action-label">Log Food</span>
            </button>
            <button className="quick-action-btn">
              <span className="action-icon">💧</span>
              <span className="action-label">Add Water</span>
            </button>
            <button className="quick-action-btn">
              <span className="action-icon">🚶</span>
              <span className="action-label">Log Steps</span>
            </button>
            <button className="quick-action-btn">
              <span className="action-icon">📊</span>
              <span className="action-label">View Progress</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="overview-card">
        <div className="card-header">
          <h3 className="card-title">Recent Activity</h3>
          <span className="card-icon">🕒</span>
        </div>
        
        <div className="recent-activity">
          <div className="activity-list">
            {workoutSessions.slice(0, 3).map(session => (
              <div key={session.id} className="activity-item">
                <div className="activity-icon workout">💪</div>
                <div className="activity-content">
                  <div className="activity-title">
                    {session.WorkoutSuggestion?.exerciseName || 'Workout Session'}
                  </div>
                  <div className="activity-time">
                    {new Date(session.sessionDate).toLocaleDateString()} • {session.status}
                  </div>
                </div>
                {session.caloriesBurned && (
                  <div className="activity-calories">
                    {session.caloriesBurned} cal
                  </div>
                )}
              </div>
            ))}
            
            {sleepLogs.slice(0, 2).map(sleep => (
              <div key={sleep.id} className="activity-item">
                <div className="activity-icon sleep">😴</div>
                <div className="activity-content">
                  <div className="activity-title">Sleep Log</div>
                  <div className="activity-time">
                    {new Date(sleep.date).toLocaleDateString()} • {sleep.duration}h
                  </div>
                </div>
                <div className="sleep-quality-badge" style={{
                  backgroundColor: getSleepQuality(sleep.quality).color
                }}>
                  {sleep.quality}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;