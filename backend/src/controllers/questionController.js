const Question = require('../models/Question');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { getIO } = require('../config/socket');

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

 
    try {
      const io = getIO();
      io.to('admins').emit('new-question', {
        _id: question._id,
        subject: question.subject,
        author: isAnonymous ? 'Anonymous' : req.user.name,
        type: isAnonymous ? 'Anonymous' : 'Direct',
        status: 'Pending',
        createdAt: question.createdAt,
      });
    } catch (socketErr) {
      console.error('[Socket.IO] Failed to emit new-question:', socketErr.message);
    }

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

  
    const notification = await Notification.create({
      user: question.author,
      title: 'Reply to your question',
      message: `An administrator has answered your question: "${question.subject}"`,
      type: 'info',
      relatedStep: 'Support',
      actionUrl: question.isAnonymous ? '/anonymous-questions' : '/direct-questions'
    });

    // Envoyer les notifications aux étudiants en temp-réel
    try {
      const io = getIO();
      io.to(`user:${question.author}`).emit('new-notification', {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        relatedStep: notification.relatedStep,
        date: notification.date,
        actionUrl: notification.actionUrl,
      });
    } catch (socketErr) {
      console.error('[Socket.IO] Failed to emit new-notification:', socketErr.message);
    }

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
