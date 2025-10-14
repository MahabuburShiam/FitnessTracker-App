// journalcomment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JournalComment = sequelize.define('JournalComment', {
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
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  parentCommentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'JournalComments',
      key: 'id'
    }
  }
});

module.exports = JournalComment;