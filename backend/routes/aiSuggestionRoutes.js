// aiSuggestionRoutes.js
const express = require('express');
const router = express.Router();
const aiSuggestionController = require('../controllers/aiSuggestionController');
const { auth } = require('../middleware/auth');

router.get('/ai-suggestions', auth, aiSuggestionController.getAISuggestions);

module.exports = router;