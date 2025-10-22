const db = require('../models');
const bcrypt = require('bcryptjs');

exports.getUserProfile = async (req, res) => {
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
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { first_name, last_name, location_lat, location_long } = req.body;
    
    const user = await db.User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      first_name,
      last_name,
      location_lat,
      location_long
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};