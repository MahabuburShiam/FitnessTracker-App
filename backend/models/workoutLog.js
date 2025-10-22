module.exports = (sequelize, DataTypes) => {
  const WorkoutLog = sequelize.define('WorkoutLog', {
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
    exercise_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    duration_minutes: {
      type: DataTypes.INTEGER
    },
    calories_burned: {
      type: DataTypes.INTEGER
    },
    sets: {
      type: DataTypes.INTEGER
    },
    reps: {
      type: DataTypes.INTEGER
    },
    weight_used: {
      type: DataTypes.DECIMAL(6, 2)
    },
    distance: {
      type: DataTypes.DECIMAL(6, 2)
    },
    log_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'workout_logs',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  WorkoutLog.associate = function(models) {
    WorkoutLog.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return WorkoutLog;
};


















    























