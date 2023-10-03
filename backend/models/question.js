const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  response: {
    type: String,
    required: true,
    trim: true,
  },
  // Additional properties for each answer can be added here if needed
});

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  answers: {
    type: [String], // or whatever your answer schema looks like
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [function() { return !this.isDefault; }, 'User Id is required']
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Question', questionSchema);
