// backend/controllers/journalController.js
const { Journal, JournalComment, JournalRating, User } = require('../models');
const { Op } = require('sequelize');

exports.createJournal = async (req, res) => {
  try {
    const { title, content, category, tags, isPublished } = req.body;

    const journal = await Journal.create({
      userId: req.user.id,
      title,
      content,
      category,
      tags: tags || [],
      isPublished: isPublished || false
    });

    res.status(201).json({ journal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJournals = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    let whereClause = { isPublished: true };
    
    if (category) {
      whereClause.category = category;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
        { tags: { [Op.contains]: [search] } }
      ];
    }

    const journals = await Journal.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'id']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({ journals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserJournals = async (req, res) => {
  try {
    const journals = await Journal.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ journals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { journalId } = req.params;
    const { content, parentCommentId } = req.body;

    const comment = await JournalComment.create({
      userId: req.user.id,
      journalId,
      content,
      parentCommentId: parentCommentId || null
    });

    await Journal.increment('totalComments', { where: { id: journalId } });

    res.status(201).json({ comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rateJournal = async (req, res) => {
  try {
    const { journalId } = req.params;
    const { rating } = req.body;

    const [journalRating, created] = await JournalRating.findOrCreate({
      where: {
        userId: req.user.id,
        journalId
      },
      defaults: { rating }
    });

    if (!created) {
      await journalRating.update({ rating });
    }

    await this.updateJournalRating(journalId);

    res.json({ journalRating, created });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateJournalRating = async (journalId) => {
  const ratings = await JournalRating.findAll({
    where: { journalId },
    attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings']]
  });

  if (ratings[0]) {
    await Journal.update({
      averageRating: parseFloat(ratings[0].get('avgRating') || 0),
      totalRatings: parseInt(ratings[0].get('totalRatings') || 0)
    }, { where: { id: journalId } });
  }
};