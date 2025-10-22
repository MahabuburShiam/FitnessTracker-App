module.exports = (sequelize, DataTypes) => {
  const Trainer = sequelize.define('Trainer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    trainer_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    qualifications: {
      type: DataTypes.TEXT
    },
    specialties: {
      type: DataTypes.STRING(255)
    },
    charge_per_hour: {
      type: DataTypes.DECIMAL(10, 2)
    }
  }, {
    tableName: 'trainers',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Trainer.associate = function(models) {
    Trainer.belongsTo(models.User, { foreignKey: 'trainer_user_id', as: 'user' });
    Trainer.hasMany(models.TrainerAvailability, { foreignKey: 'trainer_id', as: 'availability' });
    Trainer.hasMany(models.TrainerReview, { foreignKey: 'trainer_id', as: 'reviews' });
  };

  return Trainer;
};