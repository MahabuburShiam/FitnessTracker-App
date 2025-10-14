// backend/routes/workoutgoalRoutes.js
const express = require('express');
const router = express.Router();
const workoutgoalController = require('../controllers/workoutgoalcontroller.js');

// Create a new workout goal
router.post('/goals', workoutgoalController.createWorkoutGoal);

// Get workout goals (with optional status filter)
router.get('/goals', workoutgoalController.getWorkoutGoals);

// Update a specific workout goal
router.put('/goals/:goalId', workoutgoalController.updateWorkoutGoal);

// Delete a specific workout goal
router.delete('/goals/:goalId', workoutgoalController.deleteWorkoutGoal);

module.exports = router;