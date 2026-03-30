const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Pending', 'Answered'],
    default: 'Pending',
  },
  answer: {
    type: String,
    default: '',
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
