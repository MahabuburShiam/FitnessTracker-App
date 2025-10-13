// messagingController.js
const messagingService = require('../services/messagingService');

exports.createConversation = async (req, res) => {
  try {
    const { participantIds, title } = req.body;

    const { conversation, participants } = await messagingService.createConversation(
      participantIds, 
      title, 
      req.user.id
    );

    res.status(201).json({ conversation, participants });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, messageType, attachments } = req.body;

    const message = await messagingService.sendMessage(
      conversationId,
      req.user.id,
      content,
      messageType,
      attachments
    );

    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const conversations = await messagingService.getConversations(
      req.user.id,
      page,
      limit
    );

    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page, limit } = req.query;

    const messages = await messagingService.getMessages(
      conversationId,
      req.user.id,
      page,
      limit
    );

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findOrCreateDirectConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if direct conversation already exists
    let conversation = await messagingService.findDirectConversation(req.user.id, userId);

    if (!conversation) {
      // Create new direct conversation
      const result = await messagingService.createConversation([userId], null, req.user.id);
      conversation = result.conversation;
    }

    res.json({ conversation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

    



