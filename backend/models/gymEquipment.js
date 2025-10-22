module.exports = (sequelize, DataTypes) => {
  const GymEquipment = sequelize.define('GymEquipment', {
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
    equipment_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'gym_equipment',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  GymEquipment.associate = function(models) {
    GymEquipment.belongsTo(models.Gym, { foreignKey: 'gym_id', as: 'gym' });
  };

  return GymEquipment;
};