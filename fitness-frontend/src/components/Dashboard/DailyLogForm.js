import React, { useState, useEffect } from 'react';
import './DailyLogForm.css';

const DailyLogForm = ({ todayLog, onUpdate, loading }) => {
  const [formData, setFormData] = useState({
    calories: '',
    steps: '',
    waterIntake: '',
    weight: '',
    mood: '',
    energyLevel: '',
    sleepQuality: '',
    workoutDone: false,
    workoutIntensity: '',
    workoutDuration: '',
    notes: ''
  });

  useEffect(() => {
    if (todayLog) {
      setFormData({
        calories: todayLog.calories || '',
        steps: todayLog.steps || '',
        waterIntake: todayLog.waterIntake || '',
        weight: todayLog.weight || '',
        mood: todayLog.mood || '',
        energyLevel: todayLog.energyLevel || '',
        sleepQuality: todayLog.sleepQuality || '',
        workoutDone: todayLog.workoutDone || false,
        workoutIntensity: todayLog.workoutIntensity || '',
        workoutDuration: todayLog.workoutDuration || '',
        notes: todayLog.notes || ''
      });
    }
  }, [todayLog]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuickAdd = (type, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: (parseInt(prev[type]) || 0) + value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/daily-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        if (onUpdate) {
          await onUpdate();
        }
        // Show success message
        alert('Daily log updated successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update log');
      }
    } catch (error) {
      alert('Error updating daily log');
    }
  };

  return (
    <div className="daily-log-form">
      <form onSubmit={handleSubmit}>
        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            <div className="quick-action">
              <label>Add Steps</label>
              <div className="quick-buttons">
                <button type="button" onClick={() => handleQuickAdd('steps', 1000)}>+1K</button>
                <button type="button" onClick={() => handleQuickAdd('steps', 5000)}>+5K</button>
              </div>
            </div>
            <div className="quick-action">
              <label>Add Water</label>
              <div className="quick-buttons">
                <button type="button" onClick={() => handleQuickAdd('waterIntake', 0.25)}>+250ml</button>
                <button type="button" onClick={() => handleQuickAdd('waterIntake', 0.5)}>+500ml</button>
              </div>
            </div>
            <div className="quick-action">
              <label>Workout</label>
              <div className="workout-toggle">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="workoutDone"
                    checked={formData.workoutDone}
                    onChange={handleInputChange}
                  />
                  <span className="slider"></span>
                </label>
                <span>{formData.workoutDone ? 'Workout Done' : 'No Workout'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Metrics */}
        <div className="form-section">
          <h3>Basic Metrics</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Calories Consumed</label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleInputChange}
                placeholder="Enter calories"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Steps</label>
              <input
                type="number"
                name="steps"
                value={formData.steps}
                onChange={handleInputChange}
                placeholder="Enter steps"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Water Intake (L)</label>
              <input
                type="number"
                name="waterIntake"
                value={formData.waterIntake}
                onChange={handleInputChange}
                placeholder="Enter liters"
                min="0"
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Enter weight"
                min="1"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Wellness */}
        <div className="form-section">
          <h3>Wellness</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Mood</label>
              <select name="mood" value={formData.mood} onChange={handleInputChange}>
                <option value="">Select Mood</option>
                <option value="excellent">😄 Excellent</option>
                <option value="good">😊 Good</option>
                <option value="average">😐 Average</option>
                <option value="poor">😔 Poor</option>
                <option value="terrible">😢 Terrible</option>
              </select>
            </div>
            <div className="form-group">
              <label>Energy Level</label>
              <select name="energyLevel" value={formData.energyLevel} onChange={handleInputChange}>
                <option value="">Select Energy</option>
                <option value="very_high">⚡ Very High</option>
                <option value="high">🔋 High</option>
                <option value="moderate">🔅 Moderate</option>
                <option value="low">🪫 Low</option>
                <option value="very_low">😴 Very Low</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sleep Quality</label>
              <select name="sleepQuality" value={formData.sleepQuality} onChange={handleInputChange}>
                <option value="">Select Sleep Quality</option>
                <option value="excellent">😴 Excellent</option>
                <option value="good">😊 Good</option>
                <option value="fair">😐 Fair</option>
                <option value="poor">😔 Poor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Workout Details */}
        {formData.workoutDone && (
          <div className="form-section">
            <h3>Workout Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Workout Intensity</label>
                <select name="workoutIntensity" value={formData.workoutIntensity} onChange={handleInputChange}>
                  <option value="">Select Intensity</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  name="workoutDuration"
                  value={formData.workoutDuration}
                  onChange={handleInputChange}
                  placeholder="Enter duration"
                  min="1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="form-section">
          <h3>Notes</h3>
          <div className="form-group">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any notes about your day..."
              rows="4"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Daily Log'}
        </button>
      </form>
    </div>
  );
};

export default DailyLogForm;