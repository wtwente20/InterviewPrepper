const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  customQuestions: [{
    questionText: String,
    answers: [String],  // Allowing multiple answers per question
  }],
  responses: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    answers: [String],  // Also allowing multiple answers for default questions
  }],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
