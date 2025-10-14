import React from 'react';
import './SleepAnalysis.css';

const SleepAnalysis = ({ analysis, loading, selectedPeriod, onPeriodChange }) => {
  if (loading) {
    return (
      <div className="sleep-analysis-loading">
        <div className="loading-spinner"></div>
        <p>Analyzing your sleep patterns...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="sleep-analysis-empty">
        <h3>No Sleep Data Available</h3>
        <p>Start logging your sleep to get personalized analysis and recommendations.</p>
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
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

  const getScoreColor = (score) => {
    if (score >= 80) return '#00b894';
    if (score >= 60) return '#fdcb6e';
    return '#e17055';
  };

  return (
    <div className="sleep-analysis">
      {/* Period Selector */}
      <div className="analysis-header">
        <h3>Sleep Analysis</h3>
        <div className="period-selector">
          <select 
            value={selectedPeriod} 
            onChange={(e) => onPeriodChange(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="key-metrics">
        <div className="metric-card main">
          <div className="metric-icon">😴</div>
          <div className="metric-content">
            <div className="metric-value">{analysis.averageDuration}h</div>
            <div className="metric-label">Average Sleep Duration</div>
            <div className="metric-trend">
              <span className="trend-icon">{getTrendIcon(analysis.qualityTrend)}</span>
              <span className="trend-text">{analysis.qualityTrend}</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-content">
            <div className="metric-value">{analysis.averageQuality}/4</div>
            <div className="metric-label">Sleep Quality</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div 
              className="metric-value" 
              style={{ color: getScoreColor(analysis.consistencyScore) }}
            >
              {analysis.consistencyScore}%
            </div>
            <div className="metric-label">Consistency</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div 
              className="metric-value"
              style={{ color: getScoreColor(analysis.sleepEfficiency) }}
            >
              {Math.round(analysis.sleepEfficiency)}%
            </div>
            <div className="metric-label">Sleep Efficiency</div>
          </div>
        </div>
      </div>

      {/* Sleep Score */}
      <div className="sleep-score-section">
        <h4>Overall Sleep Health</h4>
        <div className="sleep-score">
          <div className="score-circle">
            <div 
              className="score-fill"
              style={{ 
                background: `conic-gradient(#667eea ${analysis.consistencyScore * 3.6}deg, #e9ecef 0deg)` 
              }}
            ></div>
            <div className="score-text">
              <div className="score-number">{analysis.consistencyScore}</div>
              <div className="score-label">Score</div>
            </div>
          </div>
          <div className="score-description">
            <p>Your sleep consistency score measures how regular your sleep patterns are.</p>
            <div className="optimal-sleep">
              <span>Optimal Sleep Days: </span>
              <strong>{analysis.optimalSleepPercentage.toFixed(1)}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations-section">
        <h4>Personalized Recommendations</h4>
        <div className="recommendations-list">
          {analysis.recommendations.map((recommendation, index) => (
            <div key={index} className="recommendation-item">
              <span className="recommendation-icon">💡</span>
              <span className="recommendation-text">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Factors */}
      {analysis.riskFactors.length > 0 && (
        <div className="risk-factors-section">
          <h4>Areas for Improvement</h4>
          <div className="risk-factors-list">
            {analysis.riskFactors.map((risk, index) => (
              <div key={index} className="risk-factor-item">
                <span className="risk-icon">⚠️</span>
                <span className="risk-text">{risk}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sleep Guidelines */}
      <div className="sleep-guidelines">
        <h4>Healthy Sleep Guidelines</h4>
        <div className="guidelines-grid">
          <div className="guideline">
            <span className="guideline-icon">⏰</span>
            <div className="guideline-content">
              <strong>7-9 hours</strong>
              <span>Recommended sleep duration for adults</span>
            </div>
          </div>
          <div className="guideline">
            <span className="guideline-icon">🕒</span>
            <div className="guideline-content">
              <strong>Consistent schedule</strong>
              <span>Go to bed and wake up at the same time daily</span>
            </div>
          </div>
          <div className="guideline">
            <span className="guideline-icon">🌙</span>
            <div className="guideline-content">
              <strong>Dark & cool room</strong>
              <span>Optimal sleep environment conditions</span>
            </div>
          </div>
          <div className="guideline">
            <span className="guideline-icon">📱</span>
            <div className="guideline-content">
              <strong>No screens 1 hour before bed</strong>
              <span>Reduce blue light exposure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepAnalysis;