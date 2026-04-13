const express = require('express');
const { createSubject, getSubjects } = require('../controllers/subjectController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createSubject)
  .get(protect, getSubjects);

module.exports = router;