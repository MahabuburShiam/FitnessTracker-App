'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('bmi_records', 'height', {
      type: Sequelize.DECIMAL(6, 2),
      allowNull: false,
    });
    await queryInterface.changeColumn('bmi_records', 'weight', {
      type: Sequelize.DECIMAL(6, 2),
      allowNull: false,
    });
    await queryInterface.changeColumn('bmi_records', 'bmi_value', {
      type: Sequelize.DECIMAL(6, 2),
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    // This part is for reverting the changes if needed
    await queryInterface.changeColumn('bmi_records', 'height', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
    });
    await queryInterface.changeColumn('bmi_records', 'weight', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
    });
    await queryInterface.changeColumn('bmi_records', 'bmi_value', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
    });
  }
};
