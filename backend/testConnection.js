const sequelize = require('./config/database.js');

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully.');
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
  });
