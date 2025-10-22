const express = require('express');
const db = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Advanced gym search with location
router.get('/gyms/advanced', auth, async (req, res) => {
  try {
    const { 
      search, 
      lat, 
      lng, 
      radius = 50, // default 50km radius
      minRating,
      maxPrice 
    } = req.query;

    let gyms = await db.Gym.findAll({
      include: [
        {
          model: db.User,
          as: 'owner',
          attributes: ['id', 'first_name', 'last_name', 'location_lat', 'location_long']
        },
        {
          model: db.GymReview,
          as: 'reviews'
        },
        {
          model: db.GymMembershipPlan,
          as: 'membership_plans',
          where: { is_active: true },
          required: false
        }
      ]
    });

    // Apply text search filter
    if (search) {
      gyms = gyms.filter(gym => 
        gym.gym_name.toLowerCase().includes(search.toLowerCase()) ||
        gym.address.toLowerCase().includes(search.toLowerCase()) ||
        gym.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply location filter
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const searchRadius = parseFloat(radius);

      gyms = gyms.filter(gym => {
        if (!gym.owner.location_lat || !gym.owner.location_long) return false;
        
        const distance = calculateDistance(
          userLat,
          userLng,
          parseFloat(gym.owner.location_lat),
          parseFloat(gym.owner.location_long)
        );
        
        gym.distance = distance; // Add distance to gym object
        return distance <= searchRadius;
      });

      // Sort by distance
      gyms.sort((a, b) => a.distance - b.distance);
    }

    // Apply rating filter
    if (minRating) {
      const minRatingNum = parseFloat(minRating);
      gyms = gyms.filter(gym => {
        if (!gym.reviews || gym.reviews.length === 0) return false;
        const avgRating = gym.reviews.reduce((acc, review) => acc + review.rating, 0) / gym.reviews.length;
        return avgRating >= minRatingNum;
      });
    }

    // Apply price filter
    if (maxPrice) {
      const maxPriceNum = parseFloat(maxPrice);
      gyms = gyms.filter(gym => {
        if (!gym.membership_plans || gym.membership_plans.length === 0) return true;
        
        // Check if any membership plan is within budget
        return gym.membership_plans.some(plan => plan.price <= maxPriceNum);
      });
    }

    res.json(gyms);
  } catch (error) {
    console.error('Advanced gym search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Advanced trainer search with location
router.get('/trainers/advanced', auth, async (req, res) => {
  try {
    const { 
      search, 
      lat, 
      lng, 
      radius = 50,
      minRating,
      maxPrice,
      specialties 
    } = req.query;

    let trainers = await db.Trainer.findAll({
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'location_lat', 'location_long']
        },
        {
          model: db.TrainerReview,
          as: 'reviews'
        }
      ]
    });

    // Apply text search filter
    if (search) {
      trainers = trainers.filter(trainer => 
        trainer.user.first_name.toLowerCase().includes(search.toLowerCase()) ||
        trainer.user.last_name.toLowerCase().includes(search.toLowerCase()) ||
        trainer.qualifications?.toLowerCase().includes(search.toLowerCase()) ||
        trainer.specialties?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply location filter
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const searchRadius = parseFloat(radius);

      trainers = trainers.filter(trainer => {
        if (!trainer.user.location_lat || !trainer.user.location_long) return false;
        
        const distance = calculateDistance(
          userLat,
          userLng,
          parseFloat(trainer.user.location_lat),
          parseFloat(trainer.user.location_long)
        );
        
        trainer.distance = distance;
        return distance <= searchRadius;
      });

      trainers.sort((a, b) => a.distance - b.distance);
    }

    // Apply rating filter
    if (minRating) {
      const minRatingNum = parseFloat(minRating);
      trainers = trainers.filter(trainer => {
        if (!trainer.reviews || trainer.reviews.length === 0) return false;
        const avgRating = trainer.reviews.reduce((acc, review) => acc + review.rating, 0) / trainer.reviews.length;
        return avgRating >= minRatingNum;
      });
    }

    // Apply price filter
    if (maxPrice) {
      const maxPriceNum = parseFloat(maxPrice);
      trainers = trainers.filter(trainer => 
        !trainer.charge_per_hour || trainer.charge_per_hour <= maxPriceNum
      );
    }

    // Apply specialties filter
    if (specialties) {
      const specialtyList = specialties.split(',').map(s => s.trim().toLowerCase());
      trainers = trainers.filter(trainer => 
        trainer.specialties && 
        specialtyList.some(specialty => 
          trainer.specialties.toLowerCase().includes(specialty)
        )
      );
    }

    res.json(trainers);
  } catch (error) {
    console.error('Advanced trainer search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;