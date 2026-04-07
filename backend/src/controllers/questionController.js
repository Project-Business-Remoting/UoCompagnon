const Question = require('../models/Question');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { getIO } = require('../config/socket');

const createQuestion = async (req, res, next) => {
  try {
    const { subject, content, isAnonymous } = req.body;
    
    if (!subject || !content) {
      return res.status(400).json({ message: 'Le sujet et le contenu sont obligatoires.' });
    }

    const question = await Question.create({
      subject,
      content,
      author: req.user._id,
      isAnonymous: Boolean(isAnonymous)
    });

    await question.populate('author', 'name email program');
 
    try {
      const io = getIO();
      // On envoie l'objet en format compatible avec ce que le frontend attend (peuplé)
      io.to('admins').emit('new-question', {
        ...question.toObject(),
        author: isAnonymous ? { name: 'Anonymous' } : question.author,
        authorName: isAnonymous ? 'Anonymous' : (question.author?.name || 'Étudiant'),
        type: isAnonymous ? 'Anonymous' : 'Direct',
        status: 'Pending'
      });
    } catch (socketErr) {
      console.error('[Socket.IO] Failed to emit new-question:', socketErr.message);
    }

    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
};

const getMyQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find({ author: req.user._id })
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    next(err);
  }
};

const getAllQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find()
      .populate('author', 'name email program')
      .sort({ createdAt: -1 });
    
    res.json(questions);
  } catch (err) {
    next(err);
  }
};

const replyToQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({ message: 'Le contenu de la réponse est obligatoire.' });
    }

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question non trouvée.' });
    }

    question.answer = answer;
    question.status = 'Answered';
    await question.save();

  
    const notification = await Notification.create({
      user: question.author,
      title: {
        fr: 'Réponse à votre question',
        en: 'Reply to your question'
      },
      message: {
        fr: `Un administrateur a répondu à votre question : "${question.subject}"`,
        en: `An administrator has answered your question: "${question.subject}"`
      },
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
      
      // On émet aussi la question modifiée pour la mise à jour instantanée de la vue
      io.to(`user:${question.author}`).emit('question-replied', question);
    } catch (socketErr) {
      console.error('[Socket.IO] Failed to emit new-notification:', socketErr.message);
    }

    res.json(question);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createQuestion,
  getMyQuestions,
  getAllQuestions,
  replyToQuestion
};
