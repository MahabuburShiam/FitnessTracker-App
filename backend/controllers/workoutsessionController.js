// backend/controllers/workoutsessionController.js
const { WorkoutSession, WorkoutSuggestion, User } = require('../models');
const { Op } = require('sequelize');

exports.createWorkoutSession = async (req, res) => {
  try {
    const { workoutSuggestionId, sessionDate, startTime, exercises, notes, intensity, mood, energyLevel } = req.body;

    const workoutSession = await WorkoutSession.create({
      userId: req.user.id,
      workoutSuggestionId,
      sessionDate: sessionDate || new Date().toISOString().split('T')[0],
      startTime: startTime || new Date(),
      exercises,
      notes,
      intensity,
      mood,
      energyLevel,
      status: 'planned'
    });

    res.status(201).json({ workoutSession });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWorkoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { endTime, duration, caloriesBurned, exercises, notes, status, mood, energyLevel } = req.body;

    const workoutSession = await WorkoutSession.findOne({
      where: {
        id: sessionId,
        userId: req.user.id
      }
    });

    if (!workoutSession) {
      return res.status(404).json({ error: 'Workout session not found' });
    }

    await workoutSession.update({
      endTime,
      duration,
      caloriesBurned,
      exercises: exercises || workoutSession.exercises,
      notes: notes || workoutSession.notes,
      status: status || workoutSession.status,
      mood: mood || workoutSession.mood,
      energyLevel: energyLevel || workoutSession.energyLevel
    });

    res.json({ workoutSession });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWorkoutSessions = async (req, res) => {
  try {
    const { startDate, endDate, status, limit = 30 } = req.query;
    
    let whereClause = { userId: req.user.id };
    
    if (startDate && endDate) {
      whereClause.sessionDate = {
        [Op.between]: [startDate, endDate]
      };
    }

    if (status) {
      whereClause.status = status;
    }

    const workoutSessions = await WorkoutSession.findAll({
      where: whereClause,
      include: [
        {
          model: WorkoutSuggestion,
          attributes: ['exerciseName', 'description', 'category']
        }
      ],
      order: [['sessionDate', 'DESC'], ['startTime', 'DESC']],
      limit: parseInt(limit)
    });

    // Calculate statistics
    const stats = {
      totalSessions: workoutSessions.length,
      completedSessions: workoutSessions.filter(s => s.status === 'completed').length,
      totalDuration: workoutSessions.filter(s => s.status === 'completed').reduce((sum, s) => sum + (s.duration || 0), 0),
      totalCalories: workoutSessions.filter(s => s.status === 'completed').reduce((sum, s) => sum + (s.caloriesBurned || 0), 0),
      averageMood: this.calculateAverageMood(workoutSessions),
      consistency: this.calculateConsistency(workoutSessions)
    };

    res.json({ workoutSessions, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWorkoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const workoutSession = await WorkoutSession.findOne({
      where: {
        id: sessionId,
        userId: req.user.id
      },
      include: [
        {
          model: WorkoutSuggestion,
          attributes: ['exerciseName', 'description', 'category', 'sets', 'reps']
        }
      ]
    });

    if (!workoutSession) {
      return res.status(404).json({ error: 'Workout session not found' });
    }

    res.json({ workoutSession });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteWorkoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const workoutSession = await WorkoutSession.findOne({
      where: {
        id: sessionId,
        userId: req.user.id
      }
    });

    if (!workoutSession) {
      return res.status(404).json({ error: 'Workout session not found' });
    }

    await workoutSession.destroy();

    res.json({ message: 'Workout session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper methods
exports.calculateAverageMood = (sessions) => {
  const moodValues = {
    'excellent': 5,
    'good': 4,
    'average': 3,
    'poor': 2,
    'terrible': 1
  };

  const completedSessions = sessions.filter(s => s.status === 'completed' && s.mood);
  if (completedSessions.length === 0) return 0;

  const total = completedSessions.reduce((sum, session) => {
    return sum + (moodValues[session.mood] || 0);
  }, 0);

  return (total / completedSessions.length).toFixed(1);
};

exports.calculateConsistency = (sessions) => {
  const completedSessions = sessions.filter(s => s.status === 'completed');
  if (sessions.length === 0) return 0;

  return ((completedSessions.length / sessions.length) * 100).toFixed(1);
};