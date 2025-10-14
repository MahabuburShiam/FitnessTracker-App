// gymRoutes.js
const express = require('express');
const router = express.Router();
const gymController = require('../controllers/gymController');
const { auth } = require('../middleware/auth');

router.post('/gyms', auth, gymController.createGym);
router.get('/gyms/nearby', auth, gymController.getNearbyGyms);
router.post('/gyms/:gymId/rate', auth, gymController.rateGym);

module.exports = router;