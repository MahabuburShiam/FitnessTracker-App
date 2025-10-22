const express = require('express');
const db = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const users = await db.User.findAll({
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const user = await db.User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.userId, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: db.Gym,
          as: 'gym',
          include: [
            { model: db.GymPhoto, as: 'photos' },
            { model: db.GymAmenity, as: 'amenities' },
            { model: db.GymEquipment, as: 'equipment' },
            { model: db.GymMembershipPlan, as: 'membership_plans' }
          ]
        },
        {
          model: db.Trainer,
          as: 'trainer_profile',
          include: [
            { model: db.TrainerAvailability, as: 'availability' }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;