module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    user_type: {
      type: DataTypes.ENUM('user', 'gym_owner', 'trainer'),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    location_lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    location_long: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false
    }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  User.associate = function(models) {
    User.hasOne(models.Gym, { foreignKey: 'owner_id', as: 'gym' });
    User.hasOne(models.Trainer, { foreignKey: 'trainer_user_id', as: 'trainer_profile' });
    User.hasMany(models.FitnessJournal, { foreignKey: 'user_id', as: 'journals' });
    User.hasMany(models.JournalRating, { foreignKey: 'rater_id', as: 'given_ratings' });
    User.hasMany(models.UserGoal, { foreignKey: 'user_id', as: 'goals' });
    User.hasMany(models.SleepLog, { foreignKey: 'user_id', as: 'sleep_logs' });
    User.hasMany(models.DietChart, { foreignKey: 'user_id', as: 'diet_charts' });
    User.hasMany(models.Message, { foreignKey: 'sender_id', as: 'sent_messages' });
    User.hasMany(models.Message, { foreignKey: 'receiver_id', as: 'received_messages' });
    User.hasMany(models.BmiRecord, { foreignKey: 'user_id', as: 'bmi_records' });
    User.hasMany(models.WorkoutLog, { foreignKey: 'user_id', as: 'workout_logs' });
    User.hasMany(models.Notification, { foreignKey: 'user_id', as: 'notifications' });
    User.hasMany(models.AiRecommendation, { foreignKey: 'user_id', as: 'ai_recommendations' });
    User.hasMany(models.GymReview, { foreignKey: 'reviewer_id', as: 'gym_reviews' });
    User.hasMany(models.TrainerReview, { foreignKey: 'reviewer_id', as: 'trainer_reviews' });
  };

  return User;
};