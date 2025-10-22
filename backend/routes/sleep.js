const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get sleep logs
router.get('/', auth, async (req, res) => {
  try {
    const sleepLogs = await db.SleepLog.findAll({
      where: { user_id: req.user.userId },
      order: [['log_date', 'DESC']]
    });
    res.json(sleepLogs);
  } catch (error) {
    console.error('Get sleep logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Log sleep
router.post('/', [
  auth,
  body('log_date').isDate(),
  body('hours_slept').isFloat({ min: 0, max: 24 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const sleepLog = await db.SleepLog.create({
      user_id: req.user.userId,
      ...req.body
    });

    res.status(201).json(sleepLog);
  } catch (error) {
    console.error('Log sleep error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update sleep log
router.put('/:id', auth, async (req, res) => {
  try {
    const sleepLog = await db.SleepLog.findOne({
      where: { id: req.params.id, user_id: req.user.userId }
    });

    if (!sleepLog) {
      return res.status(404).json({ message: 'Sleep log not found' });
    }

    await sleepLog.update(req.body);
    res.json(sleepLog);
  } catch (error) {
    console.error('Update sleep log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete sleep log
router.delete('/:id', auth, async (req, res) => {
  try {
    const sleepLog = await db.SleepLog.findOne({
      where: { id: req.params.id, user_id: req.user.userId }
    });

    if (!sleepLog) {
      return res.status(404).json({ message: 'Sleep log not found' });
    }

    await sleepLog.destroy();
    res.json({ message: 'Sleep log deleted successfully' });
  } catch (error) {
    console.error('Delete sleep log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;