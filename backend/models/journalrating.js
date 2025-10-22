module.exports = (sequelize, DataTypes) => {
  const JournalRating = sequelize.define('JournalRating', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    journal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fitness_journals',
        key: 'id'
      }
    },
    rater_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
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
    tableName: 'journal_ratings',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  JournalRating.associate = function(models) {
    JournalRating.belongsTo(models.FitnessJournal, { foreignKey: 'journal_id', as: 'journal' });
    JournalRating.belongsTo(models.User, { foreignKey: 'rater_id', as: 'rater' });
  };

  return JournalRating;
};