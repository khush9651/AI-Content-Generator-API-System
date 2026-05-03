const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { generateLimiter } = require('../middleware/rateLimiter');

// POST /api/content/generate
router.post('/generate', generateLimiter, contentController.generate);

// GET /api/content/history
router.get('/history', contentController.getHistory);

// DELETE /api/content/history/:id
router.delete('/history/:id', contentController.deleteHistoryItem);

module.exports = router;
