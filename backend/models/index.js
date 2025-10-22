const { Sequelize } = require('sequelize');
const config = require('../config/database.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./users')(sequelize, Sequelize);
db.Gym = require('./gym')(sequelize, Sequelize);
db.Trainer = require('./trainer')(sequelize, Sequelize);
db.FitnessJournal = require('./fitnessJournal')(sequelize, Sequelize);
db.JournalRating = require('./journalRating')(sequelize, Sequelize);
db.UserGoal = require('./userGoal')(sequelize, Sequelize);
db.SleepLog = require('./sleepLog')(sequelize, Sequelize);
db.DietChart = require('./dietChart')(sequelize, Sequelize);
db.Message = require('./message')(sequelize, Sequelize);
db.BmiRecord = require('./bmiRecord')(sequelize, Sequelize);
db.GymPhoto = require('./gymPhoto')(sequelize, Sequelize);
db.GymAmenity = require('./gymAmenity')(sequelize, Sequelize);
db.GymEquipment = require('./gymEquipment')(sequelize, Sequelize);
db.TrainerAvailability = require('./trainerAvailability')(sequelize, Sequelize);
db.WorkoutLog = require('./workoutLog')(sequelize, Sequelize);
db.Notification = require('./notification')(sequelize, Sequelize);
db.GymMembershipPlan = require('./gymMembershipPlan')(sequelize, Sequelize);
db.AiRecommendation = require('./aiRecommendation')(sequelize, Sequelize);
db.GymReview = require('./gymReview')(sequelize, Sequelize);
db.TrainerReview = require('./trainerReview')(sequelize, Sequelize);

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;