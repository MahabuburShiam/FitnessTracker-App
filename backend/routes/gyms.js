const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all gyms
router.get('/', auth, async (req, res) => {
  try {
    const gyms = await db.Gym.findAll({
      include: [
        {
          model: db.User,
          as: 'owner',
          attributes: ['id', 'first_name', 'last_name', 'email', 'location_lat', 'location_lng']
        }
      ]
    });
    res.json(gyms);
  } catch (error) {
    console.error('Get gyms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get gym by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const gym = await db.Gym.findByPk(req.params.id, {
      include: [
        {
          model: db.User,
          as: 'owner',
          attributes: ['id', 'first_name', 'last_name', 'email', 'location_lat', 'location_lng']
        }
      ]
    });

    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }

    res.json(gym);
  } catch (error) {
    console.error('Get gym error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create/Update gym (for gym owners)
router.post(
  '/',
  [
    auth,
    body('gym_name').notEmpty().withMessage('Gym name is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('location_lat').optional().isFloat().withMessage('Latitude must be a number'),
    body('location_lng').optional().isFloat().withMessage('Longitude must be a number'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (req.user.userType !== 'gym_owner') {
        return res.status(403).json({ message: 'Only gym owners can create gyms' });
      }

      // Check if gym already exists for this owner
      let gym = await db.Gym.findOne({ where: { owner_id: req.user.userId } });

      if (gym) {
        // Update existing gym
        await gym.update(req.body);
      } else {
        // Create new gym
        gym = await db.Gym.create({
          owner_id: req.user.userId,
          ...req.body
        });
      }

      res.json(gym);
    } catch (error) {
      console.error('Create/Update gym error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Advanced search for gyms
router.get('/search/advanced', auth, async (req, res) => {
  try {
    const { lat, lng, radius, maxPrice, minRating, search } = req.query;

    let whereClause = {};

    // Text search
    if (search) {
      whereClause = {
        [Op.or]: [
          { gym_name: { [Op.iLike]: `%${search}%` } },
          { address: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    let gyms = await db.Gym.findAll({
      where: whereClause,
      include: [
        {
          model: db.User,
          as: 'owner',
          attributes: ['id', 'first_name', 'last_name', 'email', 'location_lat', 'location_lng']
        },
        { model: db.GymReview, as: 'reviews' }
      ]
    });

    // Filter by location if provided
    if (lat && lng && radius) {
      gyms = gyms.filter(gym => {
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          parseFloat(gym.owner.location_lat),
          parseFloat(gym.owner.location_lng)
        );
        return distance <= parseFloat(radius);
      });
    }

    // Filter by minimum rating if provided
    if (minRating) {
      gyms = gyms.filter(gym => {
        const avgRating = gym.reviews.length > 0
          ? gym.reviews.reduce((acc, review) => acc + review.rating, 0) / gym.reviews.length
          : 0;
        return avgRating >= parseFloat(minRating);
      });
    }

    res.json(gyms);
  } catch (error) {
    console.error('Advanced gym search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate distance between two coordinates (in km)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = router;

























module.exports = router;