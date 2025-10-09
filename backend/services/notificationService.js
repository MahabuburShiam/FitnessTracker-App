// notificationService.js
const { WorkoutGoal, User } = require('../models');
const { Op } = require('sequelize');

class NotificationService {
  
  async getGoalReminders(userId) {
    const goals = await WorkoutGoal.findAll({
      where: {
        userId,
        status: 'active',
        targetDate: {
          [Op.gte]: new Date()
        }
      }
    });

    const reminders = [];

    for (const goal of goals) {
      const daysLeft = this.calculateDaysLeft(goal.targetDate);
      const progress = await this.calculateGoalProgress(userId, goal);
      
      reminders.push({
        goalId: goal.id,
        goalType: goal.goalType,
        targetDate: goal.targetDate,
        daysLeft,
        progress: progress.percentage,
        message: this.generateReminderMessage(goal, daysLeft, progress),
        urgency: this.calculateUrgency(daysLeft, progress.percentage)
      });
    }

    return reminders;
  }

  calculateDaysLeft(targetDate) {
    if (!targetDate) return null;
    
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  async calculateGoalProgress(userId, goal) {
    // This is a simplified progress calculation
    // You would implement actual progress tracking based on workout sessions, weight changes, etc.
    
    const user = await User.findByPk(userId);
    let progress = 0;
    let message = '';

    switch (goal.goalType) {
      case 'weight_loss':
        if (goal.targetWeight && user.weight) {
          const startWeight = user.weight; // You would store initial weight
          const totalToLose = startWeight - goal.targetWeight;
          const currentLoss = startWeight - user.weight;
          progress = Math.min(100, (currentLoss / totalToLose) * 100);
          message = `Lost ${currentLoss.toFixed(1)}kg of ${totalToLose.toFixed(1)}kg target`;
        }
        break;
      
      case 'muscle_gain':
        // Implement muscle gain progress
        progress = 25; // Placeholder
        message = 'Track your strength progress in workout sessions';
        break;
      
      case 'endurance':
        // Implement endurance progress
        progress = 40; // Placeholder
        message = 'Monitor your cardio performance improvements';
        break;
      
      default:
        progress = 50;
        message = 'Keep working towards your goal';
    }

    return { percentage: progress, message };
  }

  generateReminderMessage(goal, daysLeft, progress) {
    if (daysLeft === null) {
      return `Continue working on your ${goal.goalType.replace('_', ' ')} goal. Progress: ${progress.percentage}%`;
    }

    if (daysLeft < 0) {
      return `Goal deadline passed! ${progress.message}`;
    } else if (daysLeft <= 7) {
      return `Only ${daysLeft} days left! ${progress.message}`;
    } else if (daysLeft <= 30) {
      return `${daysLeft} days remaining for your goal. Progress: ${progress.percentage}%`;
    } else {
      return `You have ${daysLeft} days to achieve your ${goal.goalType.replace('_', ' ')} goal`;
    }
  }

  calculateUrgency(daysLeft, progress) {
    if (daysLeft === null) return 'low';
    
    const expectedProgress = daysLeft > 0 ? (1 - (daysLeft / 90)) * 100 : 100;
    
    if (progress < expectedProgress - 20) return 'high';
    if (progress < expectedProgress - 10) return 'medium';
    return 'low';
  }
}

module.exports = new NotificationService();