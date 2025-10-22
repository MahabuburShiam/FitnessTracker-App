module.exports = (sequelize, DataTypes) => {
  const TrainerAvailability = sequelize.define('TrainerAvailability', {
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
    day_of_week: {
      type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'trainer_availability',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  TrainerAvailability.associate = function(models) {
    TrainerAvailability.belongsTo(models.Trainer, { foreignKey: 'trainer_id', as: 'trainer' });
  };

  return TrainerAvailability;
};