const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's journals
router.get('/my', auth, async (req, res) => {
  try {
    const journals = await db.FitnessJournal.findAll({
      where: { user_id: req.user.userId },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: db.JournalRating,
          as: 'ratings',
          include: [
            {
              model: db.User,
              as: 'rater',
              attributes: ['id', 'first_name', 'last_name']
            }
          ]
        }
      ]
    });
    res.json(journals);
  } catch (error) {
    console.error('Get journals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all public journals
router.get('/public', auth, async (req, res) => {
  try {
    const journals = await db.FitnessJournal.findAll({
      order: [['created_at', 'DESC']],
      include: [
        {
          model: db.User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name']
        },
        {
          model: db.JournalRating,
          as: 'ratings'
        }
      ]
    });
    res.json(journals);
  } catch (error) {
    console.error('Get public journals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create journal
router.post('/', [
  auth,
  body('title').notEmpty(),
  body('content').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const journal = await db.FitnessJournal.create({
      user_id: req.user.userId,
      ...req.body
    });

    res.status(201).json(journal);
  } catch (error) {
    console.error('Create journal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate journal
router.post('/:id/rate', [
  auth,
  body('rating').isInt({ min: 1, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingRating = await db.JournalRating.findOne({
      where: {
        journal_id: req.params.id,
        rater_id: req.user.userId
      }
    });

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this journal' });
    }

    const rating = await db.JournalRating.create({
      journal_id: req.params.id,
      rater_id: req.user.userId,
      rating: req.body.rating
    });

    res.status(201).json(rating);
  } catch (error) {
    console.error('Rate journal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;