module.exports = (sequelize, DataTypes) => {
  const AiRecommendation = sequelize.define('AiRecommendation', {
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
    recommendation_type: {
      type: DataTypes.ENUM('sleep_analysis', 'diet_suggestion', 'exercise_suggestion'),
      allowNull: false
    },
    input_data: {
      type: DataTypes.JSON
    },
    recommendation_text: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'ai_recommendations',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  AiRecommendation.associate = function(models) {
    AiRecommendation.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return AiRecommendation;
};