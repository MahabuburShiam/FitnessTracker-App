const express = require('express');
const { body, param, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get messages with specific user
router.get('/conversation/:userId', [
  auth,
  param('userId').isInt({ min: 1 }).withMessage('User ID must be a positive integer.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const currentUserId = req.user.userId;
    const otherUserId = parseInt(req.params.userId);

    // Verify other user exists
    const otherUser = await db.User.findByPk(otherUserId, {
      attributes: ['id', 'first_name', 'last_name', 'user_type']
    });

    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const messages = await db.Message.findAll({
      where: {
        [Op.or]: [
          {
            sender_id: currentUserId,
            receiver_id: otherUserId
          },
          {
            sender_id: otherUserId,
            receiver_id: currentUserId
          }
        ]
      },
      include: [
        {
          model: db.User,
          as: 'sender',
          attributes: ['id', 'first_name', 'last_name', 'user_type']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    res.json({
      otherUser,
      messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/send', [
  auth,
  body('receiver_id').isInt(),
  body('content').isLength({ min: 1, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiver_id, content } = req.body;
    const sender_id = req.user.userId;

    // Check if receiver exists
    const receiver = await db.User.findByPk(receiver_id);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Prevent sending to self
    if (sender_id === receiver_id) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    const message = await db.Message.create({
      sender_id,
      receiver_id,
      content: content.trim()
    });

    const messageWithSender = await db.Message.findByPk(message.id, {
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
      ]
    });

    res.status(201).json(messageWithSender);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.patch('/read/:userId', [
  auth
], async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const otherUserId = parseInt(req.params.userId);

    await db.Message.update(
      { is_read: true },
      {
        where: {
          sender_id: otherUserId,
          receiver_id: currentUserId,
          is_read: false
        }
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark messages read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;