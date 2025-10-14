// trainerRoutes.js
const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const { auth } = require('../middleware/auth');

router.post('/trainer/profile', auth, trainerController.createTrainerProfile);
router.get('/trainers', auth, trainerController.getTrainers);
router.post('/trainers/:trainerId/rate', auth, trainerController.rateTrainer);

module.exports = router;