import React, { useState, useEffect } from 'react';
import WorkoutForm from './WorkoutForm';
import WorkoutHistory from './WorkoutHistory';
import './WorkoutSessions.css';

const WorkoutSessions = ({ sessions, stats, onUpdate }) => {
  const [activeView, setActiveView] = useState('today');
  const [todayWorkouts, setTodayWorkouts] = useState([]);

  useEffect(() => {
    // Filter today's workouts
    const today = new Date().toISOString().split('T')[0];
    const todayWorkouts = sessions.filter(session => session.sessionDate === today);
    setTodayWorkouts(todayWorkouts);
  }, [sessions]);

  return (
    <div className="workout-sessions">
      {/* Header */}
      <div className="workout-header">
        <h2>Workout Sessions</h2>
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${activeView === 'today' ? 'active' : ''}`}
            onClick={() => setActiveView('today')}
          >
            Today's Workouts
          </button>
          <button 
            className={`toggle-btn ${activeView === 'history' ? 'active' : ''}`}
            onClick={() => setActiveView('history')}
          >
            Workout History
          </button>
          <button 
            className={`toggle-btn ${activeView === 'new' ? 'active' : ''}`}
            onClick={() => setActiveView('new')}
          >
            New Workout
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      {activeView !== 'new' && (
        <div className="workout-stats">
          <div className="stat-item">
            <div className="stat-value">{stats?.totalSessions || 0}</div>
            <div className="stat-label">Total Sessions</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats?.completedSessions || 0}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {stats?.totalDuration ? `${Math.round(stats.totalDuration / 60)}h` : '0h'}
            </div>
            <div className="stat-label">Total Time</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats?.totalCalories || 0}</div>
            <div className="stat-label">Calories Burned</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats?.consistency || 0}%</div>
            <div className="stat-label">Consistency</div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="workout-content">
        {activeView === 'today' && (
          <div className="today-workouts">
            <h3>Today's Workouts</h3>
            {todayWorkouts.length > 0 ? (
              <div className="workouts-list">
                {todayWorkouts.map(workout => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            ) : (
              <div className="empty-workouts">
                <p>No workouts planned for today</p>
                <button 
                  className="btn-primary"
                  onClick={() => setActiveView('new')}
                >
                  Plan a Workout
                </button>
              </div>
            )}
          </div>
        )}

        {activeView === 'history' && (
          <WorkoutHistory sessions={sessions} onUpdate={onUpdate} />
        )}

        {activeView === 'new' && (
          <WorkoutForm onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
};

// Simple Workout Card Component
const WorkoutCard = ({ workout }) => {
  const getStatusColor = (status) => {
    const colors = {
      planned: '#feca57',
      in_progress: '#48dbfb',
      completed: '#1dd1a1',
      skipped: '#ff6b6b',
      cancelled: '#636e72'
    };
    return colors[status] || '#dfe6e9';
  };

  return (
    <div className="workout-card">
      <div className="workout-header">
        <h4>{workout.WorkoutSuggestion?.exerciseName || 'Custom Workout'}</h4>
        <span 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(workout.status) }}
        >
          {workout.status.replace('_', ' ')}
        </span>
      </div>
      <div className="workout-details">
        {workout.startTime && (
          <span>Time: {new Date(workout.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        )}
        {workout.duration && <span>Duration: {workout.duration}min</span>}
        {workout.caloriesBurned && <span>Calories: {workout.caloriesBurned}</span>}
      </div>
      {workout.notes && (
        <p className="workout-notes">{workout.notes}</p>
      )}
    </div>
  );
};

export default WorkoutSessions;