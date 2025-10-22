// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth'); // Assuming auth is the default export
const authorize = require('../middleware/authorize');

router.delete('/users/:id', auth, authorize(['admin']), adminController.deleteUser);
router.get('/statistics', auth, authorize(['admin']), adminController.getStatistics);

module.exports = router;