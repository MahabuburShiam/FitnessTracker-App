const { Gym, GymRating, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const { calculateDistance } = require('../utils/geolocation');

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
      location: { latitude, longitude },
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

exports.getAllGyms = async (req, res) => {
    try {
        const gyms = await Gym.findAll({
            include: [
                { model: User, as: 'Owner', attributes: ['firstName', 'lastName'] },
                { model: GymRating, attributes: ['rating'] }
            ]
        });
        res.json({ gyms });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGymById = async (req, res) => {
    try {
        const { gymId } = req.params;
        const gym = await Gym.findByPk(gymId, {
            include: [
                { model: User, as: 'Owner', attributes: ['firstName', 'lastName'] },
                { model: GymRating, include: [{ model: User, attributes: ['firstName'] }] }
            ]
        });
        if (!gym) {
            return res.status(404).json({ error: 'Gym not found' });
        }
        res.json({ gym });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getNearbyGyms = async (req, res) => {
  try {
    const { radius = 10, limit = 20 } = req.query;
    const user = await User.findByPk(req.user.id);

    if (!user || !user.location || !user.location.latitude || !user.location.longitude) {
      return res.status(400).json({ error: 'Your location is not set. Please update your profile.' });
    }

    const { latitude, longitude } = user.location;

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

    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);
    
    const gymsWithDistance = gyms.map(gym => {
      const gymData = gym.toJSON();
      if (gymData.location && gymData.location.latitude && gymData.location.longitude) {
        const distance = calculateDistance(
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

    const nearbyGyms = gymsWithDistance
      .filter(gym => gym.distance !== null && gym.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    res.json({ gyms: nearbyGyms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGym = async (req, res) => {
    try {
        const { gymId } = req.params;
        const gym = await Gym.findByPk(gymId);

        if (!gym) {
            return res.status(404).json({ error: 'Gym not found' });
        }

        if (gym.ownerId !== req.user.id && req.user.userType !== 'admin') {
            return res.status(403).json({ error: 'You are not authorized to update this gym' });
        }

        const { name, description, latitude, longitude, address, facilities, openingHours, contactEmail, contactPhone } = req.body;

        await gym.update({
            name: name || gym.name,
            description: description || gym.description,
            location: (latitude && longitude) ? { latitude, longitude } : gym.location,
            address: address || gym.address,
            facilities: facilities || gym.facilities,
            openingHours: openingHours || gym.openingHours,
            contactEmail: contactEmail || gym.contactEmail,
            contactPhone: contactPhone || gym.contactPhone
        });

        res.json({ gym });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteGym = async (req, res) => {
    try {
        const { gymId } = req.params;
        const gym = await Gym.findByPk(gymId);

        if (!gym) {
            return res.status(404).json({ error: 'Gym not found' });
        }

        if (gym.ownerId !== req.user.id && req.user.userType !== 'admin') {
            return res.status(403).json({ error: 'You are not authorized to delete this gym' });
        }

        await gym.destroy();
        res.json({ message: 'Gym deleted successfully' });
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