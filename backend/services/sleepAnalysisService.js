// sleepAnalysisService.js
const { SleepLog } = require('../models');
const { Op } = require('sequelize');

class SleepAnalysisService {
  
  // Simple ML-based sleep pattern analysis
  analyzeSleepPatterns(sleepLogs) {
    if (sleepLogs.length === 0) {
      return {
        averageDuration: 0,
        consistencyScore: 0,
        qualityTrend: 'insufficient_data',
        recommendations: ['Need more sleep data for analysis'],
        riskFactors: []
      };
    }

    const durations = sleepLogs.map(log => log.duration);
    const qualities = sleepLogs.map(log => this.qualityToNumber(log.quality));
    
    const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const averageQuality = qualities.reduce((a, b) => a + b, 0) / qualities.length;
    
    // Calculate consistency (standard deviation of sleep duration)
    const durationVariance = durations.reduce((acc, duration) => 
      acc + Math.pow(duration - averageDuration, 2), 0) / durations.length;
    const consistencyScore = Math.max(0, 100 - (Math.sqrt(durationVariance) * 20));

    // Trend analysis
    const recentLogs = sleepLogs.slice(-7);
    const oldLogs = sleepLogs.slice(0, -7);
    
    const recentAvg = recentLogs.length > 0 ? 
      recentLogs.reduce((acc, log) => acc + log.duration, 0) / recentLogs.length : 0;
    const oldAvg = oldLogs.length > 0 ? 
      oldLogs.reduce((acc, log) => acc + log.duration, 0) / oldLogs.length : recentAvg;

    const trend = recentAvg > oldAvg ? 'improving' : 
                 recentAvg < oldAvg ? 'declining' : 'stable';

    // Generate recommendations
    const recommendations = this.generateRecommendations(averageDuration, averageQuality, consistencyScore, trend);
    const riskFactors = this.identifyRiskFactors(averageDuration, averageQuality, consistencyScore);

    return {
      averageDuration: parseFloat(averageDuration.toFixed(2)),
      averageQuality: parseFloat(averageQuality.toFixed(2)),
      consistencyScore: parseFloat(consistencyScore.toFixed(2)),
      qualityTrend: trend,
      sleepEfficiency: this.calculateSleepEfficiency(sleepLogs),
      recommendations,
      riskFactors,
      optimalSleepPercentage: this.calculateOptimalSleepPercentage(sleepLogs)
    };
  }

  qualityToNumber(quality) {
    const qualityMap = { 'poor': 1, 'fair': 2, 'good': 3, 'excellent': 4 };
    return qualityMap[quality] || 2;
  }

  calculateSleepEfficiency(sleepLogs) {
    // Simple sleep efficiency calculation based on duration and quality
    const efficiencies = sleepLogs.map(log => {
      const qualityScore = this.qualityToNumber(log.quality);
      const durationScore = Math.min(log.duration / 8, 1); // 8 hours as optimal
      return (qualityScore * durationScore) / 4 * 100; // Normalize to percentage
    });
    
    return efficiencies.length > 0 ? 
      efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length : 0;
  }

  calculateOptimalSleepPercentage(sleepLogs) {
    const optimalSleeps = sleepLogs.filter(log => 
      log.duration >= 7 && log.duration <= 9 && 
      ['good', 'excellent'].includes(log.quality)
    ).length;
    
    return (optimalSleeps / sleepLogs.length) * 100;
  }

  generateRecommendations(avgDuration, avgQuality, consistency, trend) {
    const recommendations = [];

    if (avgDuration < 6) {
      recommendations.push('Consider increasing sleep duration to 7-9 hours for better recovery');
    } else if (avgDuration > 9) {
      recommendations.push('Monitor if excessive sleep persists, could indicate underlying health issues');
    }

    if (avgQuality < 2.5) {
      recommendations.push('Improve sleep environment: dark room, cool temperature, reduce noise');
      recommendations.push('Avoid screens 1 hour before bedtime and establish a consistent sleep routine');
    }

    if (consistency < 70) {
      recommendations.push('Try to maintain consistent sleep and wake times, even on weekends');
    }

    if (trend === 'declining') {
      recommendations.push('Sleep quality is declining. Consider stress management techniques');
    }

    if (recommendations.length === 0) {
      recommendations.push('Great sleep habits! Maintain your current routine');
    }

    return recommendations;
  }

  identifyRiskFactors(avgDuration, avgQuality, consistency) {
    const riskFactors = [];

    if (avgDuration < 5) {
      riskFactors.push('Severe sleep deprivation risk');
    } else if (avgDuration < 6) {
      riskFactors.push('Moderate sleep deprivation risk');
    }

    if (avgQuality < 2) {
      riskFactors.push('Poor sleep quality affecting daily functioning');
    }

    if (consistency < 50) {
      riskFactors.push('Irregular sleep pattern disrupting circadian rhythm');
    }

    return riskFactors;
  }

  async getSleepAnalysis(userId, period = 'week') {
    let dateRange = new Date();
    
    switch (period) {
      case 'week':
        dateRange.setDate(dateRange.getDate() - 7);
        break;
      case 'month':
        dateRange.setMonth(dateRange.getMonth() - 1);
        break;
      case 'year':
        dateRange.setFullYear(dateRange.getFullYear() - 1);
        break;
      default:
        // Custom days
        dateRange.setDate(dateRange.getDate() - parseInt(period));
    }

    const sleepLogs = await SleepLog.findAll({
      where: {
        userId,
        date: {
          [Op.gte]: dateRange.toISOString().split('T')[0]
        }
      },
      order: [['date', 'ASC']]
    });

    return this.analyzeSleepPatterns(sleepLogs);
  }
}

module.exports = new SleepAnalysisService();