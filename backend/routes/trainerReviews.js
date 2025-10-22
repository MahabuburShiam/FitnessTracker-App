const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get reviews for a trainer
router.get('/trainer/:trainerId', async (req, res) => {
  try {
    const reviews = await db.TrainerReview.findAll({
      where: { trainer_id: req.params.trainerId },
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
    console.error('Get trainer reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit a review for a trainer
router.post('/trainer/:trainerId', [
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

    // Check if user already reviewed this trainer
    const existingReview = await db.TrainerReview.findOne({
      where: {
        trainer_id: req.params.trainerId,
        reviewer_id: req.user.userId
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this trainer' });
    }

    const review = await db.TrainerReview.create({
      trainer_id: req.params.trainerId,
      reviewer_id: req.user.userId,
      rating,
      review_text
    });

    const reviewWithUser = await db.TrainerReview.findByPk(review.id, {
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
    console.error('Create trainer review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;