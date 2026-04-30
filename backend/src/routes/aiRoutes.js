const express = require('express');
const { analyzeWithAI } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/analyze', protect, analyzeWithAI);

module.exports = router;