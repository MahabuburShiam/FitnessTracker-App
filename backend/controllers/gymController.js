// backend/controllers/gymController.js
const { Gym, GymRating, User, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.createGym = async (req, res) => {
  try {
    if (req.user.userType !== 'gym_owner') {
      return res.status(403).json({ error: 'Only gym owners can create gyms' });
    }

    const { name, description, latitude, longitude, address, facilities, openingHours, contactEmail, contactPhone } = req.body;

    const gym = await Gym.create({
      ownerId: req.user.id,
      name,
      description,
      location: { latitude, longitude }, // Changed to JSON
      address,
      facilities,
      openingHours,
      contactEmail,
      contactPhone
    });

    res.status(201).json({ gym });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNearbyGyms = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10, limit = 20 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const gyms = await Gym.findAll({
      include: [
        {
          model: User,
          as: 'Owner',
          attributes: ['firstName', 'lastName']
        },
        {
          model: GymRating,
          attributes: ['rating']
        }
      ],
      limit: parseInt(limit)
    });

    // Calculate distances and filter by radius
    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);
    
    const gymsWithDistance = gyms.map(gym => {
      const gymData = gym.toJSON();
      if (gymData.location && gymData.location.latitude && gymData.location.longitude) {
        const distance = this.calculateDistance(
          userLat, 
          userLng, 
          gymData.location.latitude, 
          gymData.location.longitude
        );
        gymData.distance = distance;
      } else {
        gymData.distance = null;
      }
      return gymData;
    });

    // Filter by radius and sort by distance
    const nearbyGyms = gymsWithDistance
      .filter(gym => gym.distance !== null && gym.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    res.json({ gyms: nearbyGyms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rateGym = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { rating, review } = req.body;

    const [gymRating, created] = await GymRating.findOrCreate({
      where: {
        userId: req.user.id,
        gymId
      },
      defaults: { rating, review }
    });

    if (!created) {
      await gymRating.update({ rating, review });
    }

    await this.updateGymRating(gymId);

    res.json({ gymRating, created });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGymRating = async (gymId) => {
  const ratings = await GymRating.findAll({
    where: { gymId },
    attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']]
  });

  if (ratings[0]) {
    await Gym.update({
      averageRating: parseFloat(ratings[0].get('avgRating') || 0),
      totalReviews: parseInt(ratings[0].get('totalReviews') || 0)
    }, { where: { id: gymId } });
  }
};

exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = this.toRad(lat2 - lat1);
  const dLon = this.toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

exports.toRad = (degrees) => {
  return degrees * (Math.PI/180);
};