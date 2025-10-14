// journalrating.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JournalRating = sequelize.define('JournalRating', {
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
  journalId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Journals',
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
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'journalId']
    }
  ]
});

module.exports = JournalRating;