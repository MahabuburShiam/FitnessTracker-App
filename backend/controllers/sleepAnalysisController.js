// backend/controllers/sleepAnalysisController.js
const sleepAnalysisService = require('../services/sleepAnalysisService');
const { SleepLog } = require('../models');
const { Op } = require('sequelize');

exports.getSleepAnalysis = async (req, res) => {
  try {
    const { period = 'week' } = req.query;

    const analysis = await sleepAnalysisService.getSleepAnalysis(req.user.id, period);

    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSleepLog = async (req, res) => {
  try {
    const { date, bedtime, wakeTime, duration, quality, notes } = req.body;

    const sleepLog = await SleepLog.create({
      userId: req.user.id,
      date: date || new Date().toISOString().split('T')[0],
      bedtime,
      wakeTime,
      duration,
      quality,
      notes
    });

    res.status(201).json({ sleepLog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSleepLogs = async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;
    
    let whereClause = { userId: req.user.id };
    
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const sleepLogs = await SleepLog.findAll({
      where: whereClause,
      order: [['date', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({ sleepLogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSleepLog = async (req, res) => {
  try {
    const { logId } = req.params;
    const { bedtime, wakeTime, duration, quality, notes } = req.body;

    const sleepLog = await SleepLog.findOne({
      where: {
        id: logId,
        userId: req.user.id
      }
    });

    if (!sleepLog) {
      return res.status(404).json({ error: 'Sleep log not found' });
    }

    await sleepLog.update({
      bedtime: bedtime || sleepLog.bedtime,
      wakeTime: wakeTime || sleepLog.wakeTime,
      duration: duration || sleepLog.duration,
      quality: quality || sleepLog.quality,
      notes: notes || sleepLog.notes
    });

    res.json({ sleepLog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};