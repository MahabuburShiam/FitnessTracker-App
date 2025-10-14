// messagingService.js
const { Conversation, ConversationParticipant, Message, User } = require('../models');
const { Op } = require('sequelize');

class MessagingService {
  
  async createConversation(participantIds, title = null, creatorId) {
    const conversation = await Conversation.create({
      title,
      conversationType: participantIds.length > 2 ? 'group' : 'direct',
      lastMessageAt: new Date()
    });

    // Add all participants including creator
    const allParticipants = [...new Set([...participantIds, creatorId])];
    
    const participants = await Promise.all(
      allParticipants.map(userId => 
        ConversationParticipant.create({
          conversationId: conversation.id,
          userId,
          role: userId === creatorId ? 'admin' : 'participant'
        })
      )
    );

    return { conversation, participants };
  }

  async sendMessage(conversationId, senderId, content, messageType = 'text', attachments = []) {
    const message = await Message.create({
      conversationId,
      senderId,
      content,
      messageType,
      attachments
    });

    // Update conversation's last message timestamp
    await Conversation.update(
      { lastMessageAt: new Date() },
      { where: { id: conversationId } }
    );

    // Mark as read for sender
    await ConversationParticipant.update(
      { lastReadAt: new Date() },
      { where: { conversationId, userId: senderId } }
    );

    return message;
  }

  async getConversations(userId, page = 1, limit = 20) {
    const conversations = await ConversationParticipant.findAll({
      where: { userId },
      include: [
        {
          model: Conversation,
          include: [
            {
              model: Message,
              limit: 1,
              order: [['createdAt', 'DESC']],
              include: [{
                model: User,
                as: 'Sender',
                attributes: ['firstName', 'lastName']
              }]
            },
            {
              model: ConversationParticipant,
              include: [{
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'userType']
              }]
            }
          ]
        }
      ],
      order: [[Conversation, 'lastMessageAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    return conversations.map(cp => {
      const conv = cp.Conversation.toJSON();
      conv.unreadCount = this.calculateUnreadCount(conv, cp.lastReadAt);
      return conv;
    });
  }

  async getMessages(conversationId, userId, page = 1, limit = 50) {
    // Mark as read when user opens conversation
    await ConversationParticipant.update(
      { lastReadAt: new Date() },
      { where: { conversationId, userId } }
    );

    const messages = await Message.findAll({
      where: { conversationId },
      include: [{
        model: User,
        as: 'Sender',
        attributes: ['id', 'firstName', 'lastName', 'userType']
      }],
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    return messages;
  }

  calculateUnreadCount(conversation, lastReadAt) {
    if (!conversation.Messages || conversation.Messages.length === 0) return 0;
    
    const lastMessage = conversation.Messages[0];
    return new Date(lastMessage.createdAt) > new Date(lastReadAt) ? 1 : 0;
  }

  async findDirectConversation(userId1, userId2) {
    const conversations = await Conversation.findAll({
      where: { conversationType: 'direct' },
      include: [
        {
          model: ConversationParticipant,
          where: { userId: userId1 }
        },
        {
          model: ConversationParticipant,
          where: { userId: userId2 }
        }
      ]
    });

    return conversations.length > 0 ? conversations[0] : null;
  }

  async addParticipant(conversationId, userId, adminId) {
    // Check if admin has permission
    const adminParticipant = await ConversationParticipant.findOne({
      where: { conversationId, userId: adminId, role: 'admin' }
    });

    if (!adminParticipant) {
      throw new Error('Only conversation admins can add participants');
    }

    const [participant, created] = await ConversationParticipant.findOrCreate({
      where: { conversationId, userId },
      defaults: { role: 'participant' }
    });

    return { participant, created };
  }
}

module.exports = new MessagingService();