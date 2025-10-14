import React from 'react';
import './WorkoutHistory.css';

const WorkoutHistory = ({ sessions, onUpdate }) => {
  return (
    <div className="workout-history">
      <h3>Workout History</h3>
      {sessions.length === 0 ? (
        <div className="empty-state">
          <p>No workout sessions found</p>
        </div>
      ) : (
        <div className="sessions-list">
          {sessions.map(session => (
            <div key={session.id} className="session-card">
              <h4>{session.WorkoutSuggestion?.exerciseName || 'Custom Workout'}</h4>
              <p>Date: {session.sessionDate}</p>
              <p>Status: {session.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;