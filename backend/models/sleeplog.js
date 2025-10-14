// backend/models/sleeplog.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SleepLog = sequelize.define('SleepLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  bedtime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  wakeTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  duration: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 24
    },
    comment: 'Sleep duration in hours'
  },
  quality: {
    type: DataTypes.ENUM('poor', 'fair', 'good', 'excellent'),
    allowNull: false
  },
  sleepInterruptions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  dreamRecall: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  wakeFeeling: {
    type: DataTypes.ENUM('refreshed', 'tired', 'exhausted', 'groggy'),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sleepAnalysis: {
    type: DataTypes.VIRTUAL,
    get() {
      const duration = this.getDataValue('duration');
      const quality = this.getDataValue('quality');
      const interruptions = this.getDataValue('sleepInterruptions');
      
      let analysis = {
        recommendation: '',
        remarks: [],
        score: 0
      };

      // Duration analysis (40 points)
      if (duration >= 7 && duration <= 9) {
        analysis.score += 40;
        analysis.remarks.push('Optimal sleep duration');
      } else if (duration >= 6 && duration < 7) {
        analysis.score += 30;
        analysis.remarks.push('Slightly below optimal sleep duration');
      } else if (duration > 9) {
        analysis.score += 20;
        analysis.remarks.push('Above average sleep duration - monitor for oversleeping');
      } else {
        analysis.score += 10;
        analysis.remarks.push('Insufficient sleep duration');
      }

      // Quality analysis (40 points)
      const qualityPoints = {
        'excellent': 40,
        'good': 30,
        'fair': 20,
        'poor': 10
      };
      analysis.score += qualityPoints[quality] || 0;
      
      if (quality === 'poor' || quality === 'fair') {
        analysis.remarks.push('Consider improving sleep environment and bedtime routine');
      }

      // Interruption analysis (20 points)
      if (interruptions === 0) {
        analysis.score += 20;
      } else if (interruptions <= 2) {
        analysis.score += 15;
      } else if (interruptions <= 4) {
        analysis.score += 10;
      } else {
        analysis.score += 5;
        analysis.remarks.push('High number of sleep interruptions detected');
      }

      // Generate recommendations based on score
      if (analysis.score >= 80) {
        analysis.recommendation = 'Excellent sleep! Maintain your current routine';
      } else if (analysis.score >= 60) {
        analysis.recommendation = 'Good sleep quality. Minor improvements possible';
      } else if (analysis.score >= 40) {
        analysis.recommendation = 'Average sleep. Consider sleep hygiene improvements';
      } else {
        analysis.recommendation = 'Poor sleep quality. Focus on sleep environment and routine';
      }

      return analysis;
    }
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'date']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['date']
    }
  ],
  hooks: {
    beforeValidate: (sleepLog) => {
      // Calculate duration from bedtime and wakeTime if not provided
      if (sleepLog.bedtime && sleepLog.wakeTime && !sleepLog.duration) {
        const bedTime = new Date(`1970-01-01T${sleepLog.bedtime}`);
        const wakeTime = new Date(`1970-01-01T${sleepLog.wakeTime}`);
        
        // Handle overnight sleep (if wakeTime is earlier than bedtime, it's next day)
        let duration = (wakeTime - bedTime) / (1000 * 60 * 60);
        if (duration < 0) {
          duration += 24; // Add 24 hours if sleep spans midnight
        }
        
        sleepLog.duration = parseFloat(duration.toFixed(2));
      }
    }
  }
});

// Instance methods
SleepLog.prototype.getSleepEfficiency = function() {
  const timeInBed = this.duration;
  const interruptions = this.sleepInterruptions || 0;
  
  // Simple sleep efficiency calculation
  const interruptionPenalty = interruptions * 0.1; // 10% penalty per interruption
  const baseEfficiency = Math.min(100, (timeInBed / 8) * 100); // 8 hours as ideal
  
  return Math.max(0, baseEfficiency - interruptionPenalty);
};

SleepLog.prototype.getSleepRecommendations = function() {
  const analysis = this.sleepAnalysis;
  const recommendations = [];
  
  if (this.duration < 6) {
    recommendations.push({
      priority: 'high',
      message: 'Increase sleep duration to 7-9 hours',
      tips: [
        'Go to bed 1 hour earlier',
        'Avoid caffeine after 2 PM',
        'Create a consistent sleep schedule'
      ]
    });
  } else if (this.duration > 9) {
    recommendations.push({
      priority: 'medium',
      message: 'Monitor if excessive sleep persists',
      tips: [
        'Could indicate recovery need or underlying issues',
        'Maintain consistent wake-up time',
        'Consult healthcare provider if persistent'
      ]
    });
  }
  
  if (this.quality === 'poor' || this.quality === 'fair') {
    recommendations.push({
      priority: 'high',
      message: 'Improve sleep quality',
      tips: [
        'Ensure dark, cool, and quiet sleep environment',
        'Avoid screens 1 hour before bedtime',
        'Practice relaxation techniques before sleep'
      ]
    });
  }
  
  if (this.sleepInterruptions > 3) {
    recommendations.push({
      priority: 'medium',
      message: 'Reduce sleep interruptions',
      tips: [
        'Limit fluids before bedtime',
        'Use white noise machine',
        'Ensure comfortable room temperature'
      ]
    });
  }
  
  return recommendations;
};

// Static methods
SleepLog.getWeeklyAnalysis = async function(userId, startDate) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  
  const sleepLogs = await this.findAll({
    where: {
      userId,
      date: {
        [Op.between]: [startDate, endDate]
      }
    },
    order: [['date', 'ASC']]
  });
  
  const analysis = {
    averageDuration: 0,
    averageQuality: 0,
    totalNights: sleepLogs.length,
    consistencyScore: 0,
    bestNight: null,
    worstNight: null,
    recommendations: []
  };
  
  if (sleepLogs.length === 0) {
    return analysis;
  }
  
  let totalDuration = 0;
  let totalScore = 0;
  let qualityCount = {
    'excellent': 0,
    'good': 0,
    'fair': 0,
    'poor': 0
  };
  
  sleepLogs.forEach(log => {
    totalDuration += log.duration;
    totalScore += log.sleepAnalysis.score;
    qualityCount[log.quality]++;
    
    // Track best and worst nights
    if (!analysis.bestNight || log.sleepAnalysis.score > analysis.bestNight.score) {
      analysis.bestNight = {
        date: log.date,
        score: log.sleepAnalysis.score,
        duration: log.duration,
        quality: log.quality
      };
    }
    
    if (!analysis.worstNight || log.sleepAnalysis.score < analysis.worstNight.score) {
      analysis.worstNight = {
        date: log.date,
        score: log.sleepAnalysis.score,
        duration: log.duration,
        quality: log.quality
      };
    }
  });
  
  analysis.averageDuration = parseFloat((totalDuration / sleepLogs.length).toFixed(2));
  analysis.averageQuality = parseFloat((totalScore / sleepLogs.length).toFixed(1));
  analysis.consistencyScore = Math.round((sleepLogs.length / 7) * 100);
  analysis.qualityDistribution = qualityCount;
  
  // Generate weekly recommendations
  if (analysis.averageDuration < 6.5) {
    analysis.recommendations.push('Focus on increasing sleep duration this week');
  }
  
  if (analysis.averageQuality < 60) {
    analysis.recommendations.push('Work on improving sleep quality through better sleep hygiene');
  }
  
  if (analysis.consistencyScore < 80) {
    analysis.recommendations.push('Aim for more consistent sleep schedule');
  }
  
  return analysis;
};

SleepLog.getSleepTrend = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const sleepLogs = await this.findAll({
    where: {
      userId,
      date: {
        [Op.gte]: startDate.toISOString().split('T')[0]
      }
    },
    order: [['date', 'ASC']],
    attributes: ['date', 'duration', 'quality', 'sleepAnalysis']
  });
  
  const trend = {
    durationTrend: sleepLogs.map(log => ({
      date: log.date,
      duration: log.duration
    })),
    qualityTrend: sleepLogs.map(log => ({
      date: log.date,
      quality: log.quality,
      score: log.sleepAnalysis.score
    })),
    averageDuration: 0,
    averageScore: 0,
    improvement: 0
  };
  
  if (sleepLogs.length > 0) {
    const totalDuration = sleepLogs.reduce((sum, log) => sum + log.duration, 0);
    const totalScore = sleepLogs.reduce((sum, log) => sum + log.sleepAnalysis.score, 0);
    
    trend.averageDuration = parseFloat((totalDuration / sleepLogs.length).toFixed(2));
    trend.averageScore = parseFloat((totalScore / sleepLogs.length).toFixed(1));
    
    // Calculate improvement (compare first half vs second half)
    if (sleepLogs.length >= 10) {
      const midpoint = Math.floor(sleepLogs.length / 2);
      const firstHalf = sleepLogs.slice(0, midpoint);
      const secondHalf = sleepLogs.slice(midpoint);
      
      const firstHalfAvg = firstHalf.reduce((sum, log) => sum + log.sleepAnalysis.score, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, log) => sum + log.sleepAnalysis.score, 0) / secondHalf.length;
      
      trend.improvement = parseFloat(((secondHalfAvg - firstHalfAvg) / firstHalfAvg * 100).toFixed(1));
    }
  }
  
  return trend;
};

module.exports = SleepLog;



















    























