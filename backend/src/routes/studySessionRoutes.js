const express = require('express');
const {
  createStudySession,
  getStudySessions,
    updateStudySession,
    deleteStudySession
} = require('../controllers/studySessionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createStudySession)
  .get(protect, getStudySessions);

  router.route('/:id')
  .put(protect, updateStudySession)
  .delete(protect, deleteStudySession);

module.exports = router;