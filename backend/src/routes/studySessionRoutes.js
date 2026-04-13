const express = require('express');
const {
  createStudySession,
  getStudySessions
} = require('../controllers/studySessionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createStudySession)
  .get(protect, getStudySessions);

module.exports = router;