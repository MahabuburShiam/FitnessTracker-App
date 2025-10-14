// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth } = require('../middleware/auth');

router.delete('/users/:userId', auth, adminController.deleteUser);
router.get('/statistics', auth, adminController.getStatistics);

module.exports = router;