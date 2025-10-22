const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get workout logs
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await db.WorkoutLog.findAll({
      where: { user_id: req.user.userId },
      order: [['log_date', 'DESC']]
    });
    res.json(workouts);
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Log workout
router.post('/', [
  auth,
  body('exercise_name').notEmpty(),
  body('log_date').isDate()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const workout = await db.WorkoutLog.create({
      user_id: req.user.userId,
      ...req.body
    });

    res.status(201).json(workout);
  } catch (error) {
    console.error('Log workout error:', error);
    res.status(500).json({ message: 'Server error' });
  }

});





















module.exports = router;