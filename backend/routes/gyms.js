const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all gyms
router.get('/', auth, async (req, res) => {
  try {
    const gyms = await db.Gym.findAll({
      include: [
        {
          model: db.User,
          as: 'owner',
          attributes: ['id', 'first_name', 'last_name', 'email']
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
          attributes: ['id', 'first_name', 'last_name', 'email']
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
router.post('/', [
  auth,
  body('gym_name').notEmpty(),
  body('address').notEmpty()
], async (req, res) => {
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
});
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

    // Price filter (if we have a pricing model, we might need to adjust)
    // For now, we assume pricing is stored as a string or in a separate table.

    // We'll do location filtering in JavaScript for simplicity, but for large datasets, use PostGIS
    let gyms = await db.Gym.findAll({
      where: whereClause,
      include: [
        {
          model: db.User,
          as: 'owner',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        { model: db.GymReview, as: 'reviews' }
      ]
    });

    // If location is provided, filter by distance
    if (lat && lng && radius) {
      gyms = gyms.filter(gym => {
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          parseFloat(gym.owner.location_lat),
          parseFloat(gym.owner.location_long)
        );
        return distance <= parseFloat(radius);
      });
    }

    // If minRating is provided, filter by average rating
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
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}


























module.exports = router;