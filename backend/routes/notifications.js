const express = require('express');
const db = require('../models');
const auth = require('../middleware/auth');
const pushService = require('../services/pushService'); // Assuming you create this service

const router = express.Router();

// Get notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await db.Notification.findAll({
      where: { user_id: req.user.userId },
      order: [['created_at', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await db.Notification.findOne({
      where: { id: req.params.id, user_id: req.user.userId }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.update({ is_read: true });
    res.json(notification);
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Subscribe to push notifications
router.post('/push/subscribe', auth, async (req, res) => {
  try {
    const { subscription } = req.body;
    const userId = req.user.userId;

    // Use the service to handle saving the subscription
    await pushService.saveSubscription(userId, subscription);
    res.status(201).json({ message: 'Subscription saved' });
  } catch (error) {
    console.error('Push subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Trigger a push notification (can be used by admins or other services)
router.post('/push/send', auth, require('../middleware/authorize')(['admin']), async (req, res) => {
  try {
    const { userId, title, message } = req.body;

    // The sendNotification method in the service expects a payload object
    const payload = {
      title: title,
      body: message
    };
    const result = await pushService.sendNotification(userId, payload);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res.json({ message: 'Push notification sent successfully' });
  } catch (error) {
    console.error('Send push notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
























module.exports = router;