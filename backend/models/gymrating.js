// gymrating.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GymRating = sequelize.define('GymRating', {
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
  gymId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Gyms',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'gymId']
    }
  ]
});

module.exports = GymRating;