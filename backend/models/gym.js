// backend/models/gym.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Gym = sequelize.define('Gym', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Stores coordinates as {latitude: x, longitude: y}'
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  facilities: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of facilities like ["pool", "sauna", "yoga_studio"]'
  },
  openingHours: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Opening hours for each day'
  },
  contactEmail: {
    type: DataTypes.STRING,
    validate: { isEmail: true }
  },
  contactPhone: {
    type: DataTypes.STRING
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  averageRating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Gym;