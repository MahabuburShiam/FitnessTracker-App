// backend/controllers/workoutgoalController.js
const { WorkoutGoal } = require('../models');
const { Op } = require('sequelize');

exports.createWorkoutGoal = async (req, res) => {
  try {
    const { goalType, targetWeight, targetDate, weeklyWorkoutDays, notes } = req.body;

    // Deactivate current active goals
    await WorkoutGoal.update(
      { status: 'abandoned' },
      {
        where: {
          userId: req.user.id,
          status: 'active'
        }
      }
    );

    const workoutGoal = await WorkoutGoal.create({
      userId: req.user.id,
      goalType,
      targetWeight,
      targetDate,
      weeklyWorkoutDays: weeklyWorkoutDays || 3,
      notes
    });

    res.status(201).json({ workoutGoal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWorkoutGoals = async (req, res) => {
  try {
    const { status } = req.query;
    
    let whereClause = { userId: req.user.id };
    
    if (status) {
      whereClause.status = status;
    }

    const workoutGoals = await WorkoutGoal.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.json({ workoutGoals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWorkoutGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { goalType, targetWeight, targetDate, weeklyWorkoutDays, status, notes } = req.body;

    const workoutGoal = await WorkoutGoal.findOne({
      where: {
        id: goalId,
        userId: req.user.id
      }
    });

    if (!workoutGoal) {
      return res.status(404).json({ error: 'Workout goal not found' });
    }

    await workoutGoal.update({
      goalType: goalType || workoutGoal.goalType,
      targetWeight: targetWeight || workoutGoal.targetWeight,
      targetDate: targetDate || workoutGoal.targetDate,
      weeklyWorkoutDays: weeklyWorkoutDays || workoutGoal.weeklyWorkoutDays,
      status: status || workoutGoal.status,
      notes: notes || workoutGoal.notes
    });

    res.json({ workoutGoal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteWorkoutGoal = async (req, res) => {
  try {
    const { goalId } = req.params;

    const workoutGoal = await WorkoutGoal.findOne({
      where: {
        id: goalId,
        userId: req.user.id
      }
    });

    if (!workoutGoal) {
      return res.status(404).json({ error: 'Workout goal not found' });
    }

    await workoutGoal.destroy();

    res.json({ message: 'Workout goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};