const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Search users by name and type
router.get('/search', [
  auth,
  body('query').optional().isString(),
  body('user_type').optional().isIn(['user', 'gym_owner', 'trainer'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { query, user_type } = req.query;
    const currentUserId = req.user.userId;

    let whereClause = {
      id: { [Op.ne]: currentUserId } // Exclude current user
    };

    // Add search query filter
    if (query && query.trim() !== '') {
      whereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${query}%` } },
        { last_name: { [Op.iLike]: `%${query}%` } },
        { email: { [Op.iLike]: `%${query}%` } }
      ];
    }

    // Add user type filter
    if (user_type) {
      whereClause.user_type = user_type;
    }

    const users = await db.User.findAll({
      where: whereClause,
      attributes: ['id', 'first_name', 'last_name', 'email', 'user_type', 'created_at'],
      order: [['first_name', 'ASC']],
      limit: 50
    });

    res.json(users);
  } catch (error) {
    console.error('User search error:', error);
    res.status(500).json({ message: 'Server error during user search' });
  }
});

// Get user's conversation list with last message
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get distinct conversations with last message
    const conversations = await db.Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      include: [
        {
          model: db.User,
          as: 'sender',
          attributes: ['id', 'first_name', 'last_name', 'user_type']
        },
        {
          model: db.User,
          as: 'receiver',
          attributes: ['id', 'first_name', 'last_name', 'user_type']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Group by conversation partner and get last message
    const conversationMap = new Map();

    conversations.forEach(message => {
      const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;
      const otherUser = message.sender_id === userId ? message.receiver : message.sender;

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          user: otherUser,
          lastMessage: message,
          unreadCount: 0,
          lastMessageTime: message.created_at
        });
      }
    });

    // Convert map to array and sort by last message time
    const conversationList = Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    res.json(conversationList);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;