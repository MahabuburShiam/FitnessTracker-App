// backend/controllers/adminController.js
const { User, Gym, Journal, TrainerProfile, sequelize } = require('../models');

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete users' });
    }

    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.userType === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Only admins can view statistics' });
    }

    const totalUsers = await User.count();
    const totalGyms = await Gym.count();
    const totalArticles = await Journal.count();
    const totalTrainers = await TrainerProfile.count();
    
    const userTypes = await User.findAll({
      attributes: ['userType', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['userType']
    });

    const recentUsers = await User.findAll({
      where: {
        createdAt: {
          [sequelize.Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({
      totalUsers,
      totalGyms,
      totalArticles,
      totalTrainers,
      userTypes,
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Only admins can view all users' });
    }

    const { page = 1, limit = 20, userType } = req.query;
    
    let whereClause = {};
    if (userType) {
      whereClause.userType = userType;
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};