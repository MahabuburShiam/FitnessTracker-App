// sleepAnalysisRoutes.js
const express = require('express');
const router = express.Router();
const sleepAnalysisController = require('../controllers/sleepAnalysisController');
const { auth } = require('../middleware/auth');

router.get('/sleep-analysis', auth, sleepAnalysisController.getSleepAnalysis);

module.exports = router;