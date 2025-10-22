const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get diet entries
router.get('/', auth, async (req, res) => {
  try {
    const dietEntries = await db.DietChart.findAll({
      where: { user_id: req.user.userId },
      order: [['log_date', 'DESC']]
    });
    res.json(dietEntries);
  } catch (error) {
    console.error('Get diet entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Log diet entry
router.post('/', [
  auth,
  body('meal_type').isIn(['Breakfast', 'Lunch', 'Dinner', 'Snack']),
  body('food_item').notEmpty(),
  body('log_date').isDate()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const dietEntry = await db.DietChart.create({
      user_id: req.user.userId,
      ...req.body
    });

    res.status(201).json(dietEntry);
  } catch (error) {
    console.error('Log diet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update diet entry
router.put('/:id', auth, async (req, res) => {
  try {
    const dietEntry = await db.DietChart.findOne({
      where: { id: req.params.id, user_id: req.user.userId }
    });

    if (!dietEntry) {
      return res.status(404).json({ message: 'Diet entry not found' });
    }

    await dietEntry.update(req.body);
    res.json(dietEntry);
  } catch (error) {
    console.error('Update diet entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete diet entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const dietEntry = await db.DietChart.findOne({
      where: { id: req.params.id, user_id: req.user.userId }
    });

    if (!dietEntry) {
      return res.status(404).json({ message: 'Diet entry not found' });
    }

    await dietEntry.destroy();
    res.json({ message: 'Diet entry deleted successfully' });
  } catch (error) {
    console.error('Delete diet entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;