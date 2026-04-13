const express = require('express');
const {
  createExam,
  getExams,
  updateExam,
  deleteExam
} = require('../controllers/examController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createExam)
  .get(protect, getExams);

router.route('/:id')
  .put(protect, updateExam)
  .delete(protect, deleteExam);

module.exports = router;