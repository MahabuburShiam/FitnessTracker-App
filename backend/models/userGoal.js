module.exports = (sequelize, DataTypes) => {
  const UserGoal = sequelize.define('UserGoal', {
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
    goal_description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    target_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    is_complete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'user_goals',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  UserGoal.associate = function(models) {
    UserGoal.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return UserGoal;
};