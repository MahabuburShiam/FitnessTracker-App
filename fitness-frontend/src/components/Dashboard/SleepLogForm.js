import React, { useState } from 'react';
import './SleepLogForm.css';

const SleepLogForm = ({ onUpdate, loading }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    bedtime: '',
    wakeTime: '',
    duration: '',
    quality: '',
    notes: ''
  });

  const [autoCalculate, setAutoCalculate] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate duration if both bedtime and wakeTime are provided
    if (autoCalculate && (name === 'bedtime' || name === 'wakeTime')) {
      if (formData.bedtime && formData.wakeTime) {
        const bedtime = new Date(`2000-01-01T${formData.bedtime}`);
        let wakeTime = new Date(`2000-01-01T${formData.wakeTime}`);
        
        // Handle overnight sleep (wake time next day)
        if (wakeTime < bedtime) {
          wakeTime.setDate(wakeTime.getDate() + 1);
        }
        
        const durationMs = wakeTime - bedtime;
        const durationHours = durationMs / (1000 * 60 * 60);
        
        setFormData(prev => ({
          ...prev,
          duration: durationHours.toFixed(1)
        }));
      }
    }
  };

  const handleQuickDuration = (hours) => {
    setFormData(prev => ({
      ...prev,
      duration: hours
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/sleep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Reset form
        setFormData({
          date: new Date().toISOString().split('T')[0],
          bedtime: '',
          wakeTime: '',
          duration: '',
          quality: '',
          notes: ''
        });
        
        if (onUpdate) {
          await onUpdate();
        }
        
        alert('Sleep log saved successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save sleep log');
      }
    } catch (error) {
      alert('Error saving sleep log');
    }
  };

  const getSleepQualityColor = (quality) => {
    const colors = {
      excellent: '#00b894',
      good: '#00cec9',
      fair: '#fdcb6e',
      poor: '#e17055'
    };
    return colors[quality] || '#dfe6e9';
  };

  return (
    <div className="sleep-log-form">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Sleep Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="form-group">
              <label>Bedtime</label>
              <input
                type="time"
                name="bedtime"
                value={formData.bedtime}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Wake Time</label>
              <input
                type="time"
                name="wakeTime"
                value={formData.wakeTime}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>
                Duration (hours)
                <span className="auto-calculate">
                  <input
                    type="checkbox"
                    checked={autoCalculate}
                    onChange={(e) => setAutoCalculate(e.target.checked)}
                  />
                  Auto-calculate
                </span>
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="0"
                max="24"
                step="0.1"
                disabled={autoCalculate}
                placeholder="Sleep duration"
              />
            </div>
          </div>

          {/* Quick Duration Buttons */}
          <div className="quick-duration">
            <label>Quick Duration:</label>
            <div className="duration-buttons">
              {[6, 7, 8, 9].map(hours => (
                <button
                  key={hours}
                  type="button"
                  className={`duration-btn ${formData.duration == hours ? 'active' : ''}`}
                  onClick={() => handleQuickDuration(hours)}
                >
                  {hours}h
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Sleep Quality</h3>
          <div className="quality-selector">
            {[
              { value: 'excellent', label: 'Excellent', emoji: '😴', description: 'Deep, restful sleep' },
              { value: 'good', label: 'Good', emoji: '😊', description: 'Good rest, few interruptions' },
              { value: 'fair', label: 'Fair', emoji: '😐', description: 'Some interruptions' },
              { value: 'poor', label: 'Poor', emoji: '😔', description: 'Frequent waking, tired' }
            ].map(quality => (
              <label 
                key={quality.value}
                className={`quality-option ${formData.quality === quality.value ? 'selected' : ''}`}
                style={{ 
                  borderColor: formData.quality === quality.value ? getSleepQualityColor(quality.value) : 'transparent'
                }}
              >
                <input
                  type="radio"
                  name="quality"
                  value={quality.value}
                  checked={formData.quality === quality.value}
                  onChange={handleInputChange}
                />
                <div className="quality-content">
                  <span className="quality-emoji">{quality.emoji}</span>
                  <span className="quality-label">{quality.label}</span>
                  <span className="quality-description">{quality.description}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Notes</h3>
          <div className="form-group">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any notes about your sleep (dreams, interruptions, etc.)..."
              rows="4"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Sleep Log'}
        </button>
      </form>
    </div>
  );
};

export default SleepLogForm;