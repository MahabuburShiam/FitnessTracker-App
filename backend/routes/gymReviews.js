const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get reviews for a gym
router.get('/gym/:gymId', async (req, res) => {
  try {
    const reviews = await db.GymReview.findAll({
      where: { gym_id: req.params.gymId },
      include: [
        {
          model: db.User,
          as: 'reviewer',
          attributes: ['id', 'first_name', 'last_name']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Get gym reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit a review for a gym
router.post('/gym/:gymId', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }),
  body('review_text').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, review_text } = req.body;

    // Check if user already reviewed this gym
    const existingReview = await db.GymReview.findOne({
      where: {
        gym_id: req.params.gymId,
        reviewer_id: req.user.userId
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this gym' });
    }

    const review = await db.GymReview.create({
      gym_id: req.params.gymId,
      reviewer_id: req.user.userId,
      rating,
      review_text
    });

    const reviewWithUser = await db.GymReview.findByPk(review.id, {
      include: [
        {
          model: db.User,
          as: 'reviewer',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    res.status(201).json(reviewWithUser);
  } catch (error) {
    console.error('Create gym review error:', error);
    res.status(500).json({ message: 'Server error' });
  }


















  const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get reviews for a gym
router.get('/gym/:gymId', async (req, res) => {
  try {
    const reviews = await db.GymReview.findAll({
      where: { gym_id: req.params.gymId },
      include: [
        {
          model: db.User,
          as: 'reviewer',
          attributes: ['id', 'first_name', 'last_name']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Get gym reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit a review for a gym
router.post('/gym/:gymId', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }),
  body('review_text').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, review_text } = req.body;

    // Check if user already reviewed this gym
    const existingReview = await db.GymReview.findOne({
      where: {
        gym_id: req.params.gymId,
        reviewer_id: req.user.userId
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this gym' });
    }

    const review = await db.GymReview.create({
      gym_id: req.params.gymId,
      reviewer_id: req.user.userId,
      rating,
      review_text
    });

    const reviewWithUser = await db.GymReview.findByPk(review.id, {
      include: [
        {
          model: db.User,
          as: 'reviewer',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    res.status(201).json(reviewWithUser);
  } catch (error) {
    console.error('Create gym review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
});

module.exports = router;