module.exports = (sequelize, DataTypes) => {
  const FitnessJournal = sequelize.define('FitnessJournal', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'fitness_journals',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  FitnessJournal.associate = function(models) {
    FitnessJournal.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
    FitnessJournal.hasMany(models.JournalRating, { foreignKey: 'journal_id', as: 'ratings' });
  };

  return FitnessJournal;
};