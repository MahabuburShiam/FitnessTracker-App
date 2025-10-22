module.exports = (sequelize, DataTypes) => {
  const TrainerReview = sequelize.define('TrainerReview', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    trainer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'trainers',
        key: 'id'
      }
    },
    reviewer_id: {
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
    },
    review_text: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'trainer_reviews',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  TrainerReview.associate = function(models) {
    TrainerReview.belongsTo(models.Trainer, { foreignKey: 'trainer_id', as: 'trainer' });
    TrainerReview.belongsTo(models.User, { foreignKey: 'reviewer_id', as: 'reviewer' });
  };

  return TrainerReview;
};