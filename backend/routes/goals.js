const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all goals for user
router.get('/', auth, async (req, res) => {
  try {
    const goals = await db.UserGoal.findAll({
      where: { user_id: req.user.userId },
      order: [['target_date', 'ASC']]
    });
    res.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create goal
router.post('/', [
  auth,
  body('goal_description').notEmpty(),
  body('target_date').isDate()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goal = await db.UserGoal.create({
      user_id: req.user.userId,
      ...req.body
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update goal
router.put('/:id', auth, async (req, res) => {
  try {
    const goal = await db.UserGoal.findOne({
      where: { id: req.params.id, user_id: req.user.userId }
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await goal.update(req.body);
    res.json(goal);
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await db.UserGoal.findOne({
      where: { id: req.params.id, user_id: req.user.userId }
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await goal.destroy();
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;