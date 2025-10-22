module.exports = (sequelize, DataTypes) => {
  const BmiRecord = sequelize.define('BmiRecord', {
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
    height: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    bmi_value: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    bmi_category: {
      type: DataTypes.STRING(50)
    }
  }, {
    tableName: 'bmi_records',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  BmiRecord.associate = function(models) {
    BmiRecord.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return BmiRecord;
};