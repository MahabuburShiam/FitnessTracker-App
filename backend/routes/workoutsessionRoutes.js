// backend/routes/workoutsessionRoutes.js
const express = require('express');
const router = express.Router();
const workoutSessionController = require('../controllers/workoutsessionController');
const { auth } = require('../middleware/auth');

router.post('/sessions', auth, workoutSessionController.createWorkoutSession);
router.get('/sessions', auth, workoutSessionController.getWorkoutSessions);
router.get('/sessions/:sessionId', auth, workoutSessionController.getWorkoutSession);
router.put('/sessions/:sessionId', auth, workoutSessionController.updateWorkoutSession);
router.delete('/sessions/:sessionId', auth, workoutSessionController.deleteWorkoutSession);

module.exports = router;