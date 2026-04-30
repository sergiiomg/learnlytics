const express = require('express');
const { analyzeWithAI, analyzeSubjectWithAI } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/analyze', protect, analyzeWithAI);
router.post('/analyze/subject/:subjectId', protect, analyzeSubjectWithAI);

module.exports = router;