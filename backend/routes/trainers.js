const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Mount the reviews router to handle nested review routes
router.use('/:trainerId/reviews', require('./trainerReviews'));

// Get all trainers
router.get('/', auth, async (req, res) => {
  try {
    const trainers = await db.Trainer.findAll({
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });
    res.json(trainers);
  } catch (error) {
    console.error('Get trainers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update trainer profile
router.put('/profile', [
  auth
], async (req, res) => {
  try {
    if (req.user.userType !== 'trainer') {
      return res.status(403).json({ message: 'Only trainers can update profile' });
    }

    const trainer = await db.Trainer.findOne({
      where: { trainer_user_id: req.user.userId }
    });

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer profile not found' });
    }

    await trainer.update(req.body);
    res.json(trainer);
  } catch (error) {
    console.error('Update trainer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;