// backend/models/workoutsuggestion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkoutSuggestion = sequelize.define('WorkoutSuggestion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    comment: 'Duration in minutes',
    allowNull: true
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: true
  },
  exercises: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of exercises with sets, reps, weights'
  }
}, {
  tableName: 'WorkoutSuggestions'
});

module.exports = WorkoutSuggestion;
