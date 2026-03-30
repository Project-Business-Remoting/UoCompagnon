const express = require('express');
const router = express.Router();
const {
  createQuestion,
  getMyQuestions,
  getAllQuestions,
  replyToQuestion
} = require('../controllers/questionController');
const { protect, adminProtect: admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createQuestion)
  .get(protect, admin, getAllQuestions);

router.get('/mine', protect, getMyQuestions);
router.put('/:id/reply', protect, admin, replyToQuestion);

module.exports = router;
