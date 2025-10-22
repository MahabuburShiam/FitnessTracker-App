module.exports = (sequelize, DataTypes) => {
  const SleepLog = sequelize.define('SleepLog', {
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
    log_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    hours_slept: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false
    }
  }, {
    tableName: 'sleep_logs',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  SleepLog.associate = function(models) {
    SleepLog.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return SleepLog;
};