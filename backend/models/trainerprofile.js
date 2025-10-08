// trainerprofile.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrainerProfile = sequelize.define('TrainerProfile', {
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
    },
    unique: true
  },
  specialization: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'e.g., ["weight_loss", "bodybuilding", "yoga", "rehabilitation"]'
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Years of experience'
  },
  certifications: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'List of certifications'
  },
  hourlyRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: { min: 0 }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  availability: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Weekly availability schedule'
  },
  averageRating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  languages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ['English']
  }
});

module.exports = TrainerProfile;