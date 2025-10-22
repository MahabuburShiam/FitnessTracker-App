const express = require('express');
const db = require('../models');
const auth = require('../middleware/auth');
const aiSuggestionService = require('../services/aiSuggestionService');
const pushService = require('../services/pushService');

const router = express.Router();

// Get personalized AI-driven suggestions (nutrition, exercise, etc.)
router.get('/recommendations', auth, async (req, res) => {
  try {
    const suggestions = await aiSuggestionService.getPersonalizedSuggestions(req.user.userId);

    // Optionally send a push notification that the report is ready
    const payload = {
      title: 'Your Personalized Report is Ready!',
      body: 'Check out your new AI-powered fitness and nutrition suggestions.',
      data: { url: '/ai-recommendations' } // URL for the client to open
    };
    await pushService.sendNotification(req.user.userId, payload);

    res.json(suggestions);
  } catch (error) {
    console.error('AI recommendation error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;