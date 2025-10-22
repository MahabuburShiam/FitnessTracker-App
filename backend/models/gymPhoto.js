module.exports = (sequelize, DataTypes) => {
  const GymPhoto = sequelize.define('GymPhoto', {
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
    photo_url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'gym_photos',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  GymPhoto.associate = function(models) {
    GymPhoto.belongsTo(models.Gym, { foreignKey: 'gym_id', as: 'gym' });
  };

  return GymPhoto;
};