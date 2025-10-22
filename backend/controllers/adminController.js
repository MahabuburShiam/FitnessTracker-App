const db = require('../models');

/**
 * @desc    Get application statistics
 * @route   GET /api/admin/statistics
 * @access  Private (Admin)
 */
exports.getStatistics = async (req, res) => {
  try {
    const userCount = await db.User.count();
    const gymCount = await db.Gym.count();
    // You can add more statistics as your application grows

    res.json({
      users: userCount,
      gyms: gymCount,
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
exports.deleteUser = async (req, res) => {
  try {
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
};