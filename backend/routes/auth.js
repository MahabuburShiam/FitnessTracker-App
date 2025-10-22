const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Register user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('user_type').isIn(['user', 'gym_owner', 'trainer']),
  body('first_name').notEmpty(),
  body('last_name').notEmpty(),
  body('location_lat').isDecimal(),
  body('location_long').isDecimal()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, user_type, first_name, last_name, location_lat, location_long } = req.body;

    // Check if user exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Use a transaction to ensure creating a user and their profile is atomic
    const newUser = await db.sequelize.transaction(async (t) => {
      const user = await db.User.create({
        email,
        password_hash,
        user_type,
        first_name,
        last_name,
        location_lat,
        location_long
      }, { transaction: t });

      // Create specific profile based on user type within the same transaction
      if (user_type === 'gym_owner') {
        await db.Gym.create({
          owner_id: user.id,
          gym_name: `${first_name}'s Gym`,
          address: 'Update address',
          pricing: 'Update pricing'
        }, { transaction: t });
      } else if (user_type === 'trainer') {
        await db.Trainer.create({
          trainer_user_id: user.id,
          qualifications: 'Update qualifications',
          specialties: 'Update specialties'
        }, { transaction: t });
      }

      return user;
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, userType: newUser.user_type },
      process.env.JWT_SECRET || 'fitness_connect_secret',
      { expiresIn: '24h' }
    );
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        user_type: newUser.user_type,
        first_name: newUser.first_name,
        last_name: newUser.last_name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, userType: user.user_type },
      process.env.JWT_SECRET || 'fitness_connect_secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Admin login
router.post('/admin/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded admin credentials
    if (email === 'admin@gmail.com' && password === 'admin2025') {
      const token = jwt.sign(
        { userId: 'admin', userType: 'admin' },
        process.env.JWT_SECRET || 'fitness_connect_secret',
        { expiresIn: '24h' }
      );

      return res.json({
        message: 'Admin login successful',
        token,
        user: {
          id: 'admin',
          email: 'admin@gmail.com',
          user_type: 'admin',
          first_name: 'Admin',
          last_name: 'User'
        }
      });
    }

    res.status(400).json({ message: 'Invalid admin credentials' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.userId, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;