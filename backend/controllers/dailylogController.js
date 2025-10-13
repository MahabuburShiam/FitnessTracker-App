// backend/controllers/dailylogController.js
const { DailyLog } = require('../models');
const { Op } = require('sequelize');

exports.createOrUpdateLog = async (req, res) => {
  try {
    const { date, calories, steps, waterIntake, weight, notes } = req.body;
    const logDate = date || new Date().toISOString().split('T')[0];

    const [log, created] = await DailyLog.findOrCreate({
      where: {
        userId: req.user.id,
        date: logDate
      },
      defaults: {
        calories: calories || 0,
        steps: steps || 0,
        waterIntake: waterIntake || 0,
        weight,
        notes
      }
    });

    if (!created) {
      await log.update({
        calories: calories !== undefined ? calories : log.calories,
        steps: steps !== undefined ? steps : log.steps,
        waterIntake: waterIntake !== undefined ? waterIntake : log.waterIntake,
        weight: weight || log.weight,
        notes: notes || log.notes
      });
    }

    res.json({ log, created });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;
    
    let whereClause = { userId: req.user.id };
    
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const logs = await DailyLog.findAll({
      where: whereClause,
      order: [['date', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLogByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const log = await DailyLog.findOne({
      where: {
        userId: req.user.id,
        date
      }
    });

    if (!log) {
      return res.status(404).json({ error: 'No log found for this date' });
    }

    res.json({ log });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const logs = await DailyLog.findAll({
      where: {
        userId: req.user.id,
        date: {
          [Op.gte]: startDate.toISOString().split('T')[0]
        }
      },
      order: [['date', 'ASC']]
    });

    const progress = {
      weightProgress: logs.filter(l => l.weight).map(l => ({
        date: l.date,
        weight: l.weight
      })),
      caloriesProgress: logs.map(l => ({
        date: l.date,
        calories: l.calories
      })),
      stepsProgress: logs.map(l => ({
        date: l.date,
        steps: l.steps
      })),
      waterProgress: logs.map(l => ({
        date: l.date,
        water: l.waterIntake
      })),
      averages: {
        calories: logs.reduce((sum, l) => sum + l.calories, 0) / logs.length || 0,
        steps: logs.reduce((sum, l) => sum + l.steps, 0) / logs.length || 0,
        water: logs.reduce((sum, l) => sum + l.waterIntake, 0) / logs.length || 0
      }
    };

    res.json({ progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};