// gymRoutes.js
const express = require('express');
const router = express.Router();
const gymController = require('../controllers/gymController');
const { auth } = require('../middleware/auth');

router.get('/gyms', auth, gymController.getAllGyms);
router.post('/gyms', auth, gymController.createGym);
router.get('/gyms/nearby', auth, gymController.getNearbyGyms);
router.get('/gyms/:gymId', auth, gymController.getGymById);
router.put('/gyms/:gymId', auth, gymController.updateGym);
router.delete('/gyms/:gymId', auth, gymController.deleteGym);
router.post('/gyms/:gymId/rate', auth, gymController.rateGym);

module.exports = router;