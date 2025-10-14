// messagingRoutes.js
const express = require('express');
const router = express.Router();
const messagingController = require('../controllers/messagingController');
const { auth } = require('../middleware/auth');

router.post('/conversations', auth, messagingController.createConversation);
router.get('/conversations', auth, messagingController.getConversations);
router.get('/conversations/direct/:userId', auth, messagingController.findOrCreateDirectConversation);
router.get('/conversations/:conversationId/messages', auth, messagingController.getMessages);
router.post('/conversations/:conversationId/messages', auth, messagingController.sendMessage);

module.exports = router;