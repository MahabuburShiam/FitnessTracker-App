'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      user_type: {
        type: Sequelize.ENUM('user', 'gym_owner', 'trainer'),
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      location_lat: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false
      },
      location_long: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};