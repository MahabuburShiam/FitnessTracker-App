module.exports = (sequelize, DataTypes) => {
  const Gym = sequelize.define('Gym', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    gym_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    pricing: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'gyms',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Gym.associate = function(models) {
    Gym.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });
    Gym.hasMany(models.GymPhoto, { foreignKey: 'gym_id', as: 'photos' });
    Gym.hasMany(models.GymAmenity, { foreignKey: 'gym_id', as: 'amenities' });
    Gym.hasMany(models.GymEquipment, { foreignKey: 'gym_id', as: 'equipment' });
    Gym.hasMany(models.GymMembershipPlan, { foreignKey: 'gym_id', as: 'membership_plans' });
    Gym.hasMany(models.GymReview, { foreignKey: 'gym_id', as: 'reviews' });
  };

  return Gym;
};