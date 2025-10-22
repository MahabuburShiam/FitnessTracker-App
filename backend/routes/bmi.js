const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Calculate BMI
router.post('/calculate', [
  auth,
  body('height').isFloat({ min: 0 }),
  body('weight').isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { height, weight } = req.body;
    
    // Calculate BMI (kg/m²)
    const heightInMeters = height / 100;
    const bmiValue = weight / (heightInMeters * heightInMeters);
    
    // Determine BMI category
    let bmiCategory;
    if (bmiValue < 18.5) {
      bmiCategory = 'Underweight';
    } else if (bmiValue < 25) {
      bmiCategory = 'Normal';
    } else if (bmiValue < 30) {
      bmiCategory = 'Overweight';
    } else {
      bmiCategory = 'Obese';
    }

    // Save BMI record
    const bmiRecord = await db.BmiRecord.create({
      user_id: req.user.userId,
      height,
      weight,
      bmi_value: parseFloat(bmiValue.toFixed(2)),
      bmi_category: bmiCategory
    });

    res.json({
      bmi: parseFloat(bmiValue.toFixed(2)),
      category: bmiCategory,
      record: bmiRecord
    });
  } catch (error) {
    console.error('BMI calculation error:', error);
    res.status(500).json({ message: 'Server error during BMI calculation' });
  }
});

// Get BMI history
router.get('/history', auth, async (req, res) => {
  try {
    const records = await db.BmiRecord.findAll({
      where: { user_id: req.user.userId },
      order: [['created_at', 'DESC']]
    });

    res.json(records);
  } catch (error) {
    console.error('Get BMI history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;