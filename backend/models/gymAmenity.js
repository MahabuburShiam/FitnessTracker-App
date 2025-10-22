module.exports = (sequelize, DataTypes) => {
  const GymAmenity = sequelize.define('GymAmenity', {
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
    amenity_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'gym_amenities',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  GymAmenity.associate = function(models) {
    GymAmenity.belongsTo(models.Gym, { foreignKey: 'gym_id', as: 'gym' });
  };

  return GymAmenity;
};