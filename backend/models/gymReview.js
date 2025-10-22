module.exports = (sequelize, DataTypes) => {
  const GymReview = sequelize.define('GymReview', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    gym_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'gyms',
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
    tableName: 'gym_reviews',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  GymReview.associate = function(models) {
    GymReview.belongsTo(models.Gym, { foreignKey: 'gym_id', as: 'gym' });
    GymReview.belongsTo(models.User, { foreignKey: 'reviewer_id', as: 'reviewer' });
  };

  return GymReview;
};