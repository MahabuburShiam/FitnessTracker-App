// journalRoutes.js
const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { auth } = require('../middleware/auth');

router.post('/journals', auth, journalController.createJournal);
router.get('/journals', auth, journalController.getJournals);
router.post('/journals/:journalId/comments', auth, journalController.addComment);
router.post('/journals/:journalId/rate', auth, journalController.rateJournal);

module.exports = router;