// backend/models/index.js
const sequelize = require('../config/database.js');

console.log('🔧 Starting model loading process...');

// Import all models with error handling
let User, WorkoutGoal, DailyLog, SleepLog, WorkoutSession, WorkoutSuggestion;
let Gym, GymRating, Journal, JournalComment, JournalRating, TrainerProfile, TrainerRating;
let Conversation, ConversationParticipant, Message;

try {
  User = require('./users.js');
  console.log('✅ User model loaded successfully');
} catch (error) {
  console.error('❌ Error loading User model:', error.message);
  process.exit(1);
}

try {
  WorkoutGoal = require('./workoutGoal.js');
  console.log('✅ WorkoutGoal model loaded successfully');
} catch (error) {
  console.error('❌ Error loading WorkoutGoal model:', error.message);
  process.exit(1);
}

try {
  DailyLog = require('./dailylog.js');
  console.log('✅ DailyLog model loaded successfully');
} catch (error) {
  console.error('❌ Error loading DailyLog model:', error.message);
  process.exit(1);
}

try {
  SleepLog = require('./sleeplog.js');
  console.log('✅ SleepLog model loaded successfully');
} catch (error) {
  console.error('❌ Error loading SleepLog model:', error.message);
  process.exit(1);
}

try {
  WorkoutSession = require('./workoutSession.js');

  console.log('✅ WorkoutSession model loaded successfully');
} catch (error) {
  console.error('❌ Error loading WorkoutSession model:', error.message);
  process.exit(1);
}

try {
  WorkoutSuggestion = require('./workoutsuggestion.js');
  console.log('✅ WorkoutSuggestion model loaded successfully');
} catch (error) {
  console.error('❌ Error loading WorkoutSuggestion model:', error.message);
  process.exit(1);
}

try {
  Gym = require('./gym.js');
  console.log('✅ Gym model loaded successfully');
} catch (error) {
  console.error('❌ Error loading Gym model:', error.message);
  process.exit(1);
}

try {
  GymRating = require('./gymrating.js');
  console.log('✅ GymRating model loaded successfully');
} catch (error) {
  console.error('❌ Error loading GymRating model:', error.message);
  process.exit(1);
}

try {
  Journal = require('./journal.js');
  console.log('✅ Journal model loaded successfully');
} catch (error) {
  console.error('❌ Error loading Journal model:', error.message);
  process.exit(1);
}

try {
  JournalComment = require('./journalcomment.js');
  console.log('✅ JournalComment model loaded successfully');
} catch (error) {
  console.error('❌ Error loading JournalComment model:', error.message);
  process.exit(1);
}

try {
  JournalRating = require('./journalrating.js');
  console.log('✅ JournalRating model loaded successfully');
} catch (error) {
  console.error('❌ Error loading JournalRating model:', error.message);
  process.exit(1);
}

try {
  TrainerProfile = require('./trainerprofile.js');
  console.log('✅ TrainerProfile model loaded successfully');
} catch (error) {
  console.error('❌ Error loading TrainerProfile model:', error.message);
  process.exit(1);
}

try {
  TrainerRating = require('./trainerrating.js');
  console.log('✅ TrainerRating model loaded successfully');
} catch (error) {
  console.error('❌ Error loading TrainerRating model:', error.message);
  process.exit(1);
}

try {
  Conversation = require('./conversation.js');
  console.log('✅ Conversation model loaded successfully');
} catch (error) {
  console.error('❌ Error loading Conversation model:', error.message);
  process.exit(1);
}

try {
  ConversationParticipant = require('./conversationparticipant.js');
  console.log('✅ ConversationParticipant model loaded successfully');
} catch (error) {
  console.error('❌ Error loading ConversationParticipant model:', error.message);
  process.exit(1);
}

try {
  Message = require('./message.js');
  console.log('✅ Message model loaded successfully');
} catch (error) {
  console.error('❌ Error loading Message model:', error.message);
  process.exit(1);
}

console.log('🎯 All models loaded successfully! Setting up associations...');

// Define associations with error handling
try {
  // User associations
  User.hasMany(WorkoutGoal, { foreignKey: 'userId' });
  WorkoutGoal.belongsTo(User, { foreignKey: 'userId' });
  console.log('✅ User-WorkoutGoal association set');

  User.hasMany(DailyLog, { foreignKey: 'userId' });
  DailyLog.belongsTo(User, { foreignKey: 'userId' });
  console.log('✅ User-DailyLog association set');

  User.hasMany(SleepLog, { foreignKey: 'userId' });
  SleepLog.belongsTo(User, { foreignKey: 'userId' });
  console.log('✅ User-SleepLog association set');

  User.hasMany(WorkoutSession, { foreignKey: 'userId' });
  WorkoutSession.belongsTo(User, { foreignKey: 'userId' });
  console.log('✅ User-WorkoutSession association set');

  User.hasMany(Gym, { foreignKey: 'ownerId', as: 'OwnedGyms' });
  Gym.belongsTo(User, { foreignKey: 'ownerId', as: 'Owner' });
  console.log('✅ User-Gym association set');

  User.hasMany(GymRating, { foreignKey: 'userId' });
  GymRating.belongsTo(User, { foreignKey: 'userId' });
  Gym.hasMany(GymRating, { foreignKey: 'gymId' });
  GymRating.belongsTo(Gym, { foreignKey: 'gymId' });
  console.log('✅ Gym rating associations set');

  // Journal associations
  User.hasMany(Journal, { foreignKey: 'userId' });
  Journal.belongsTo(User, { foreignKey: 'userId' });
  console.log('✅ User-Journal association set');

  Journal.hasMany(JournalComment, { foreignKey: 'journalId' });
  JournalComment.belongsTo(Journal, { foreignKey: 'journalId' });
  User.hasMany(JournalComment, { foreignKey: 'userId' });
  JournalComment.belongsTo(User, { foreignKey: 'userId' });
  console.log('✅ Journal comment associations set');

  Journal.hasMany(JournalRating, { foreignKey: 'journalId' });
  JournalRating.belongsTo(Journal, { foreignKey: 'journalId' });
  User.hasMany(JournalRating, { foreignKey: 'userId' });
  JournalRating.belongsTo(User, { foreignKey: 'userId' });
  console.log('✅ Journal rating associations set');

  // Trainer associations
  User.hasOne(TrainerProfile, { foreignKey: 'userId' });
  TrainerProfile.belongsTo(User, { foreignKey: 'userId' });
  console.log('✅ User-TrainerProfile association set');

  User.hasMany(TrainerRating, { foreignKey: 'trainerId', as: 'TrainerRatings' });
  TrainerRating.belongsTo(User, { foreignKey: 'trainerId', as: 'Trainer' });
  User.hasMany(TrainerRating, { foreignKey: 'userId' });
  TrainerRating.belongsTo(User, { foreignKey: 'userId' });
  console.log('✅ Trainer rating associations set');

  // Messaging associations
  User.hasMany(ConversationParticipant, { foreignKey: 'userId' });
  ConversationParticipant.belongsTo(User, { foreignKey: 'userId' });
  console.log('✅ User-ConversationParticipant association set');

  Conversation.hasMany(ConversationParticipant, { foreignKey: 'conversationId' });
  ConversationParticipant.belongsTo(Conversation, { foreignKey: 'conversationId' });
  console.log('✅ Conversation-Participant association set');

  Conversation.hasMany(Message, { foreignKey: 'conversationId' });
  Message.belongsTo(Conversation, { foreignKey: 'conversationId' });
  console.log('✅ Conversation-Message association set');

  User.hasMany(Message, { foreignKey: 'senderId', as: 'SentMessages' });
  Message.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });
  console.log('✅ User-Message association set');

  // Workout Suggestion associations
  WorkoutSuggestion.hasMany(WorkoutSession, { foreignKey: 'workoutSuggestionId' });
  WorkoutSession.belongsTo(WorkoutSuggestion, { foreignKey: 'workoutSuggestionId' });
  console.log('✅ WorkoutSuggestion-WorkoutSession association set');

  console.log('🎉 All associations set up successfully!');
} catch (error) {
  console.error('❌ Error setting up associations:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}

// Sync database
const syncDatabase = async () => {
  try {
    console.log('🔄 Attempting database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    console.log('🔄 Synchronizing models...');
    await sequelize.sync({ alter: true });
    console.log('✅ All models were synchronized successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
};

// Export all models and sequelize instance
module.exports = {
  sequelize,
  User,
  WorkoutGoal,
  DailyLog,
  SleepLog,
  WorkoutSession,
  WorkoutSuggestion,
  Gym,
  GymRating,
  Journal,
  JournalComment,
  JournalRating,
  TrainerProfile,
  TrainerRating,
  Conversation,
  ConversationParticipant,
  Message,
  syncDatabase
};