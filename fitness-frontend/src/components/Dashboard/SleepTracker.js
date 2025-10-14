import React, { useState, useEffect } from 'react';
import SleepLogForm from './SleepLogForm';
import SleepAnalysis from './SleepAnalysis';
import './SleepTracker.css';

const SleepTracker = ({ logs, onUpdate }) => {
  const [activeView, setActiveView] = useState('log');
  const [sleepAnalysis, setSleepAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    fetchSleepAnalysis();
  }, [selectedPeriod]);

  const fetchSleepAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sleep/analysis?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSleepAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Error fetching sleep analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogUpdate = async () => {
    await fetchSleepAnalysis();
    if (onUpdate) {
      await onUpdate();
    }
  };

  const getRecentSleepStats = () => {
    if (logs.length === 0) return null;

    const recentLogs = logs.slice(0, 7); // Last 7 logs
    const totalDuration = recentLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const avgDuration = totalDuration / recentLogs.length;
    
    const qualityCounts = recentLogs.reduce((acc, log) => {
      acc[log.quality] = (acc[log.quality] || 0) + 1;
      return acc;
    }, {});

    const mostCommonQuality = Object.keys(qualityCounts).reduce((a, b) => 
      qualityCounts[a] > qualityCounts[b] ? a : b
    );

    return {
      avgDuration: parseFloat(avgDuration.toFixed(1)),
      mostCommonQuality,
      loggedDays: recentLogs.length,
      consistency: Math.round((recentLogs.length / 7) * 100)
    };
  };

  const recentStats = getRecentSleepStats();

  return (
    <div className="sleep-tracker">
      {/* Header */}
      <div className="sleep-header">
        <h2>Sleep Tracker</h2>
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${activeView === 'log' ? 'active' : ''}`}
            onClick={() => setActiveView('log')}
          >
            Log Sleep
          </button>
          <button 
            className={`toggle-btn ${activeView === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveView('analysis')}
          >
            Sleep Analysis
          </button>
          <button 
            className={`toggle-btn ${activeView === 'history' ? 'active' : ''}`}
            onClick={() => setActiveView('history')}
          >
            Sleep History
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      {activeView !== 'log' && recentStats && (
        <div className="sleep-stats-overview">
          <div className="stat-card">
            <div className="stat-icon">😴</div>
            <div className="stat-content">
              <div className="stat-value">{recentStats.avgDuration}h</div>
              <div className="stat-label">Avg Duration</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-value">{recentStats.mostCommonQuality}</div>
              <div className="stat-label">Common Quality</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-value">{recentStats.loggedDays}/7</div>
              <div className="stat-label">Days Logged</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{recentStats.consistency}%</div>
              <div className="stat-label">Consistency</div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="sleep-content">
        {activeView === 'log' && (
          <SleepLogForm onUpdate={handleLogUpdate} loading={loading} />
        )}

        {activeView === 'analysis' && (
          <SleepAnalysis 
            analysis={sleepAnalysis}
            loading={loading}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        )}

        {activeView === 'history' && (
          <SleepHistory 
            logs={logs}
            onUpdate={handleLogUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default SleepTracker;