// backend/routes/dailylogRoutes.js
const express = require('express');
const router = express.Router();
const dailylogController = require('../controllers/dailylogController');

// Create or update daily log
router.post('/', dailylogController.createOrUpdateLog);

// Get daily logs with optional date range
router.get('/', dailylogController.getLogs);

// Get specific log by date
router.get('/:date', dailylogController.getLogByDate);

// Get progress data
router.get('/progress/summary', dailylogController.getProgress);

module.exports = router;