// backend/models/workoutsession.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkoutSession = sequelize.define('WorkoutSession', {
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
  workoutSuggestionId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'WorkoutSuggestions',
      key: 'id'
    }
  },
  sessionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    comment: 'Duration in minutes',
    allowNull: true
  },
  exercises: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of exercises performed with sets, reps, weights'
  },
  caloriesBurned: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Estimated calories burned'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  intensity: {
    type: DataTypes.ENUM('low', 'moderate', 'high'),
    defaultValue: 'moderate'
  },
  mood: {
    type: DataTypes.ENUM('excellent', 'good', 'average', 'poor', 'terrible'),
    allowNull: true
  },
  energyLevel: {
    type: DataTypes.ENUM('very_high', 'high', 'moderate', 'low', 'very_low'),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'skipped', 'cancelled'),
    defaultValue: 'planned'
  }
}, {
  indexes: [
    {
      fields: ['userId', 'sessionDate']
    }
  ]
});

module.exports = WorkoutSession;