'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Note: Admin user is handled through special login, so no seed needed
    // But we can create some test users if needed
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert('users', [
      {
        email: 'testuser@example.com',
        password_hash: hashedPassword,
        user_type: 'user',
        first_name: 'Test',
        last_name: 'User',
        location_lat: 40.7128,
        location_long: -74.0060,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'gymowner@example.com',
        password_hash: hashedPassword,
        user_type: 'gym_owner',
        first_name: 'Gym',
        last_name: 'Owner',
        location_lat: 40.7128,
        location_long: -74.0060,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};