// backend/models/dailylog.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DailyLog = sequelize.define('DailyLog', {
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
  calories: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  steps: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  waterIntake: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0
    },
    comment: 'Water intake in liters'
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 1,
      max: 500
    }
  },
  mood: {
    type: DataTypes.ENUM('excellent', 'good', 'average', 'poor', 'terrible'),
    allowNull: true
  },
  energyLevel: {
    type: DataTypes.ENUM('very_high', 'high', 'moderate', 'low', 'very_low'),
    allowNull: true
  },
  sleepQuality: {
    type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor'),
    allowNull: true
  },
  workoutDone: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  workoutIntensity: {
    type: DataTypes.ENUM('low', 'moderate', 'high'),
    allowNull: true
  },
  workoutDuration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Workout duration in minutes'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dailyGoalsAchieved: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Track daily goals like water intake, steps, etc.'
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
    beforeValidate: (dailylog) => {
      // Calculate if daily goals were achieved
      if (dailylog.steps && dailylog.waterIntake) {
        const goals = {
          steps: dailylog.steps >= 10000,
          water: dailylog.waterIntake >= 2.0,
          workout: dailylog.workoutDone === true,
          calories: dailylog.calories <= 2500
        };
        dailylog.dailyGoalsAchieved = goals;
      }
    }
  },
  getterMethods: {
    dailyScore() {
      let score = 0;
      const goals = this.dailyGoalsAchieved || {};
      
      if (goals.steps) score += 25;
      if (goals.water) score += 25;
      if (goals.workout) score += 25;
      if (goals.calories) score += 25;
      
      return score;
    },
    activityLevel() {
      const steps = this.steps || 0;
      if (steps < 5000) return 'sedentary';
      if (steps < 7500) return 'light';
      if (steps < 10000) return 'moderate';
      if (steps < 12500) return 'active';
      return 'very_active';
    }
  }
});

// Instance methods
DailyLog.prototype.getProgressSummary = function() {
  const goals = this.dailyGoalsAchieved || {};
  const totalGoals = Object.keys(goals).length;
  const achievedGoals = Object.values(goals).filter(Boolean).length;
  
  return {
    date: this.date,
    totalGoals: totalGoals,
    achievedGoals: achievedGoals,
    completionRate: totalGoals > 0 ? (achievedGoals / totalGoals) * 100 : 0,
    dailyScore: this.dailyScore,
    activityLevel: this.activityLevel,
    goals: goals
  };
};

DailyLog.prototype.getCalorieBalance = function(bmr) {
  const consumed = this.calories || 0;
  const burned = this.workoutDuration ? Math.round(this.workoutDuration * 7) : 0; // Approx 7 cal/min
  const netCalories = consumed - burned;
  
  return {
    consumed: consumed,
    burned: burned,
    net: netCalories,
    balance: netCalories < (bmr || 2000) ? 'deficit' : 'surplus'
  };
};

// Static methods
DailyLog.getWeeklySummary = async function(userId, startDate) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  
  const logs = await this.findAll({
    where: {
      userId,
      date: {
        [Op.between]: [startDate, endDate]
      }
    },
    order: [['date', 'ASC']]
  });
  
  const summary = {
    totalCalories: 0,
    totalSteps: 0,
    totalWater: 0,
    workoutDays: 0,
    averageDailyScore: 0,
    consistency: 0
  };
  
  logs.forEach(log => {
    summary.totalCalories += log.calories;
    summary.totalSteps += log.steps;
    summary.totalWater += log.waterIntake;
    if (log.workoutDone) summary.workoutDays++;
    summary.averageDailyScore += log.dailyScore;
  });
  
  const daysWithData = logs.length || 1;
  summary.averageDailyScore = Math.round(summary.averageDailyScore / daysWithData);
  summary.consistency = Math.round((daysWithData / 7) * 100);
  summary.averageSteps = Math.round(summary.totalSteps / daysWithData);
  summary.averageWater = parseFloat((summary.totalWater / daysWithData).toFixed(2));
  summary.averageCalories = Math.round(summary.totalCalories / daysWithData);
  
  return summary;
};

DailyLog.getStreak = async function(userId, type = 'workout') {
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let currentDate = new Date(today);
  
  while (streak < 365) { // Limit to 1 year max
    const dateStr = currentDate.toISOString().split('T')[0];
    const log = await this.findOne({
      where: { userId, date: dateStr }
    });
    
    if (!log) break;
    
    let conditionMet = false;
    switch (type) {
      case 'workout':
        conditionMet = log.workoutDone;
        break;
      case 'steps':
        conditionMet = log.steps >= 10000;
        break;
      case 'water':
        conditionMet = log.waterIntake >= 2.0;
        break;
      case 'logging':
        conditionMet = true; // Just having a log entry
        break;
    }
    
    if (conditionMet) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

module.exports = DailyLog;
