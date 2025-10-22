const db = require('../models');

exports.createGym = async (req, res) => {
  try {
    if (req.user.userType !== 'gym_owner') {
      return res.status(403).json({ message: 'Only gym owners can create gyms' });
    }

    let gym = await db.Gym.findOne({ where: { owner_id: req.user.userId } });

    if (gym) {
      await gym.update(req.body);
    } else {
      gym = await db.Gym.create({
        owner_id: req.user.userId,
        ...req.body
      });
    }

    res.json(gym);
  } catch (error) {
    console.error('Create gym error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGymDetails = async (req, res) => {
  try {
    const gym = await db.Gym.findByPk(req.params.id, {
      include: [
        {
          model: db.User,
          as: 'owner',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        { model: db.GymPhoto, as: 'photos' },
        { model: db.GymAmenity, as: 'amenities' },
        { model: db.GymEquipment, as: 'equipment' },
        { model: db.GymMembershipPlan, as: 'membership_plans' },
        { model: db.GymReview, as: 'reviews' }
      ]
    });

    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }

    res.json(gym);
  } catch (error) {
    console.error('Get gym details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};