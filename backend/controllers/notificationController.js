// backend/controllers/notificationController.js
const notificationService = require('../services/notificationService');

exports.getNotifications = async (req, res) => {
  try {
    const reminders = await notificationService.getGoalReminders(req.user.id);

    res.json({ reminders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};