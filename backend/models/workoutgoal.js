// backend/models/workoutgoal.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkoutGoal = sequelize.define('WorkoutGoal', {
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
  goalType: {
    type: DataTypes.ENUM('weight_loss', 'muscle_gain', 'maintenance', 'endurance'),
    allowNull: false
  },
  targetWeight: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 1,
      max: 500
    }
  },
  currentWeight: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 1,
      max: 500
    }
  },
  targetDate: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: true,
      isAfter: new Date().toISOString().split('T')[0]
    }
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  weeklyWorkoutDays: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
    validate: {
      min: 1,
      max: 7
    }
  },
  dailyCalorieTarget: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 500,
      max: 5000
    }
  },
  dailyProteinTarget: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 300
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'abandoned'),
    defaultValue: 'active'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  progress: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  }
}, {
  hooks: {
    beforeValidate: (goal) => {
      // Calculate progress based on time elapsed
      if (goal.startDate && goal.targetDate && goal.status === 'active') {
        const start = new Date(goal.startDate);
        const target = new Date(goal.targetDate);
        const today = new Date();
        
        const totalDuration = target - start;
        const elapsed = today - start;
        
        if (totalDuration > 0) {
          goal.progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        }
      }
      
      // Auto-complete goal if progress is 100% or target date passed
      if (goal.progress >= 100 || (goal.targetDate && new Date(goal.targetDate) < new Date())) {
        goal.status = 'completed';
        goal.progress = 100;
      }
    }
  }
});

// Instance methods
WorkoutGoal.prototype.calculateProgress = function(currentWeight = null) {
  let progress = 0;
  let message = '';
  
  switch (this.goalType) {
    case 'weight_loss':
      if (this.currentWeight && this.targetWeight && currentWeight) {
        const totalToLose = this.currentWeight - this.targetWeight;
        const currentLoss = this.currentWeight - currentWeight;
        progress = Math.min(100, Math.max(0, (currentLoss / totalToLose) * 100));
        message = `Lost ${currentLoss.toFixed(1)}kg of ${totalToLose.toFixed(1)}kg target`;
      }
      break;
      
    case 'muscle_gain':
      if (this.currentWeight && this.targetWeight && currentWeight) {
        const totalToGain = this.targetWeight - this.currentWeight;
        const currentGain = currentWeight - this.currentWeight;
        progress = Math.min(100, Math.max(0, (currentGain / totalToGain) * 100));
        message = `Gained ${currentGain.toFixed(1)}kg of ${totalToGain.toFixed(1)}kg target`;
      }
      break;
      
    case 'maintenance':
      // Progress based on consistency
      progress = this.progress;
      message = 'Maintaining current fitness level';
      break;
      
    case 'endurance':
      // Progress based on workout consistency
      progress = this.progress;
      message = 'Improving endurance and stamina';
      break;
  }
  
  return {
    progress: parseFloat(progress.toFixed(1)),
    message: message,
    daysRemaining: this.getDaysRemaining(),
    isOnTrack: this.isOnTrack(progress)
  };
};

WorkoutGoal.prototype.getDaysRemaining = function() {
  if (!this.targetDate) return null;
  
  const today = new Date();
  const target = new Date(this.targetDate);
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

WorkoutGoal.prototype.isOnTrack = function(currentProgress = null) {
  const progress = currentProgress !== null ? currentProgress : this.progress;
  const daysRemaining = this.getDaysRemaining();
  
  if (daysRemaining === null) return true;
  
  const expectedProgress = 100 - ((daysRemaining / this.getTotalDuration()) * 100);
  return progress >= expectedProgress - 10; // Allow 10% buffer
};

WorkoutGoal.prototype.getTotalDuration = function() {
  if (!this.startDate || !this.targetDate) return null;
  
  const start = new Date(this.startDate);
  const target = new Date(this.targetDate);
  const diffTime = target - start;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

WorkoutGoal.prototype.getWeeklyTarget = function() {
  const targets = {
    weight_loss: {
      workoutDays: this.weeklyWorkoutDays || 4,
      calorieDeficit: 500,
      focus: 'Cardio and strength training'
    },
    muscle_gain: {
      workoutDays: this.weeklyWorkoutDays || 4,
      calorieSurplus: 300,
      focus: 'Strength training and protein intake'
    },
    maintenance: {
      workoutDays: this.weeklyWorkoutDays || 3,
      calorieBalance: 0,
      focus: 'Balanced workouts and nutrition'
    },
    endurance: {
      workoutDays: this.weeklyWorkoutDays || 5,
      focus: 'Cardio and endurance training'
    }
  };
  
  return targets[this.goalType] || targets.maintenance;
};

// Static methods
WorkoutGoal.getActiveGoal = async function(userId) {
  return await this.findOne({
    where: {
      userId,
      status: 'active'
    }
  });
};

WorkoutGoal.getGoalHistory = async function(userId, limit = 10) {
  return await this.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit: limit
  });
};

WorkoutGoal.calculateGoalSuccessRate = async function(userId) {
  const goals = await this.findAll({
    where: { userId }
  });
  
  if (goals.length === 0) return 0;
  
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  return (completedGoals / goals.length) * 100;
};

// Virtual fields
Object.defineProperty(WorkoutGoal.prototype, 'timeRemaining', {
  get: function() {
    const days = this.getDaysRemaining();
    if (days === null) return 'No deadline set';
    
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.ceil(days / 7)} weeks`;
    return `${Math.ceil(days / 30)} months`;
  }
});

Object.defineProperty(WorkoutGoal.prototype, 'urgency', {
  get: function() {
    const daysRemaining = this.getDaysRemaining();
    const progress = this.progress;
    
    if (daysRemaining === null) return 'low';
    if (daysRemaining <= 7 && progress < 80) return 'high';
    if (daysRemaining <= 30 && progress < 50) return 'medium';
    return 'low';
  }
});

module.exports = WorkoutGoal;