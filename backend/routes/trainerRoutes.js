// trainerRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMyTrainerProfile,
  createOrUpdateTrainerProfile,
  getTrainers,
  rateTrainer
} = require('../controllers/trainerController');
const { auth } = require('../middleware/auth');

// Route to get and create/update the logged-in trainer's profile
router.route('/profile').get(auth, getMyTrainerProfile).post(auth, createOrUpdateTrainerProfile);

// Route to get a list of all trainers
router.get('/', auth, getTrainers);

// Route to rate a specific trainer
router.post('/:trainerId/rate', auth, rateTrainer);

module.exports = router;