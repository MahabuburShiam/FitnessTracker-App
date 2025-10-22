module.exports = (sequelize, DataTypes) => {
  const DietChart = sequelize.define('DietChart', {
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
    meal_type: {
      type: DataTypes.ENUM('Breakfast', 'Lunch', 'Dinner', 'Snack'),
      allowNull: false
    },
    food_item: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    log_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'diet_charts',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  DietChart.associate = function(models) {
    DietChart.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return DietChart;
};