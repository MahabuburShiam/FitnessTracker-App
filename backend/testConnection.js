require('dotenv').config({ path: 'backend/.env' });
const { sequelize } = require('./models');

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully.');
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
  });
