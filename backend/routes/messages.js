const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await db.Message.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { sender_id: req.user.userId },
          { receiver_id: req.user.userId }
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

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages with specific user
router.get('/conversations/:userId', auth, async (req, res) => {
  try {
    const messages = await db.Message.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          {
            sender_id: req.user.userId,
            receiver_id: req.params.userId
          },
          {
            sender_id: req.params.userId,
            receiver_id: req.user.userId
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

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/', [
  auth,
  body('receiver_id').isInt(),
  body('content').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const message = await db.Message.create({
      sender_id: req.user.userId,
      ...req.body
    });

    const messageWithSender = await db.Message.findByPk(message.id, {
      include: [
        {
          model: db.User,
          as: 'sender',
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

module.exports = router;