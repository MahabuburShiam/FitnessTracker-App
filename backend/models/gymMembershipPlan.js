module.exports = (sequelize, DataTypes) => {
  const GymMembershipPlan = sequelize.define('GymMembershipPlan', {
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
    plan_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    duration_months: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    features: {
      type: DataTypes.TEXT
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'gym_membership_plans',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  GymMembershipPlan.associate = function(models) {
    GymMembershipPlan.belongsTo(models.Gym, { foreignKey: 'gym_id', as: 'gym' });
  };

  return GymMembershipPlan;
};