const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
  }],
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
