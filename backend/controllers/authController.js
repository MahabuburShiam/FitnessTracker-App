// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, age, weight, height, gender, userType, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      age,
      weight,
      height,
      gender,
      userType: userType || 'user',
      location: location ? `POINT(${location.longitude} ${location.latitude})` : null
    });

    const token = generateToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        age: user.age,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        bmi: user.bmi,
        bmiCategory: user.bmiCategory
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        age: user.age,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        bmi: user.bmi,
        bmiCategory: user.bmiCategory
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, age, weight, height, gender, location } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      age: age || user.age,
      weight: weight || user.weight,
      height: height || user.height,
      gender: gender || user.gender,
      location: location ? `POINT(${location.longitude} ${location.latitude})` : user.location
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        age: user.age,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        bmi: user.bmi,
        bmiCategory: user.bmiCategory
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};