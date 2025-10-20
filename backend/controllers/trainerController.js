// trainerController.js
const { TrainerProfile, TrainerRating, User, sequelize } = require('../models');
const { Op } = require('sequelize');

// @desc    Get the profile of the logged-in trainer
// @route   GET /api/trainers/profile
// @access  Private (Trainer)
exports.getMyTrainerProfile = async (req, res) => {
  try {
    const profile = await TrainerProfile.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'email'] }],
    });
 
    if (!profile) {
      // This is not an error, it just means the trainer hasn't created a profile yet.
      return res.status(404).json({ message: 'Trainer profile not found.' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching trainer profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile.' });
  }
};

// @desc    Create or update the profile of the logged-in trainer
// @route   POST /api/trainers/profile
// @access  Private (Trainer)
exports.createOrUpdateTrainerProfile = async (req, res) => {
  try {
    const { specialization, experience, certifications, hourlyRate, bio, availability, languages } = req.body; // Assuming req.user is set by auth middleware

    const [trainerProfile, created] = await TrainerProfile.findOrCreate({
      where: { userId: req.user.id },
      defaults: {
        specialization,
        experience,
        certifications,
        hourlyRate,
        bio,
        availability,
        languages
      }
    });

    if (!created) {
      // If the profile already existed, update it with the new data.
      await trainerProfile.update({
        specialization,
        experience,
        certifications,
        hourlyRate,
        bio,
        availability,
        languages
      });
    }

    // Fetch the complete profile with user data to return to the frontend
    const updatedProfile = await TrainerProfile.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'email'] }],
    });
    res.status(created ? 201 : 200).json(updatedProfile);
  } catch (error) {
    console.error('Error saving trainer profile:', error);
    res.status(500).json({ message: 'Server error while saving profile.' });
  }
};

exports.getTrainers = async (req, res) => {
  try {
    const { specialization, minRating, maxRate, location, page = 1, limit = 10 } = req.query;
    
    let whereClause = { userType: 'trainer' };
    let trainerWhere = {};

    if (specialization) {
      trainerWhere.specialization = { [Op.contains]: [specialization] };
    }

    if (minRating) {
      trainerWhere.averageRating = { [Op.gte]: parseFloat(minRating) };
    }

    if (maxRate) {
      trainerWhere.hourlyRate = { [Op.lte]: parseFloat(maxRate) };
    }

    const trainers = await User.findAll({
      where: whereClause,
      include: [
        {
          model: TrainerProfile,
          where: trainerWhere,
          required: true
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({ trainers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rateTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const { rating, review } = req.body;

    // Check if trainer exists and is actually a trainer
    const trainer = await User.findOne({
      where: { id: trainerId, userType: 'trainer' },
      include: [TrainerProfile]
    });

    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    const [trainerRating, created] = await TrainerRating.findOrCreate({
      where: {
        userId: req.user.id,
        trainerId
      },
      defaults: { rating, review }
    });

    if (!created) {
      await trainerRating.update({ rating, review });
    }

    // Update trainer's average rating
    await this.updateTrainerRating(trainerId);

    res.json({ trainerRating, created });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTrainerRating = async (trainerId) => {
  const ratings = await TrainerRating.findAll({
    where: { trainerId },
    attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']]
  });

  if (ratings[0]) {
    await TrainerProfile.update({
      averageRating: parseFloat(ratings[0].get('avgRating') || 0),
      totalReviews: parseInt(ratings[0].get('totalReviews') || 0)
    }, { where: { userId: trainerId } });
  }
};