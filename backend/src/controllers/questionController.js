const Question = require('../models/Question');
const Notification = require('../models/Notification');
const User = require('../models/User');

const createQuestion = async (req, res) => {
  try {
    const { subject, content, isAnonymous } = req.body;
    
    if (!subject || !content) {
      return res.status(400).json({ message: 'Subject and content are required' });
    }

    const question = await Question.create({
      subject,
      content,
      author: req.user._id,
      isAnonymous: Boolean(isAnonymous)
    });

    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create question', error: err.message });
  }
};

const getMyQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ author: req.user._id })
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch questions', error: err.message });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('author', 'name email program')
      .sort({ createdAt: -1 });
    
    // For anonymous questions, we can choose to mask the author on the backend optionally.
    // However, it's easier to fetch everything and mask it on the frontend admin UI 
    // to keep the frontend logic clean and allow DB consistency.
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all questions', error: err.message });
  }
};

const replyToQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({ message: 'Answer content is required' });
    }

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.answer = answer;
    question.status = 'Answered';
    await question.save();

    // Create a private notification for the student
    await Notification.create({
      user: question.author,
      title: 'Reply to your question',
      message: `An administrator has answered your question: "${question.subject}"`,
      type: 'info',
      relatedStep: 'Support'
    });

    res.json(question);
  } catch (err) {
    res.status(500).json({ message: 'Failed to reply to question', error: err.message });
  }
};

module.exports = {
  createQuestion,
  getMyQuestions,
  getAllQuestions,
  replyToQuestion
};
