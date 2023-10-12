const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer')
const authMiddleware = require('../middlewares/authMiddleware');

// Get universal questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().populate('answers');
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Create a new question
router.post('/user/:userId/create-question', authMiddleware, async (req, res) => {
  try {
    const { questionText } = req.body;
    
    const userId = req.user._id || req.user.id;

    if (userId !== req.params.userId) {
      return res.status(403).json({ error: "Unauthorized action" });
    }

    const newQuestion = new Question({
      questionText,
      userId,
      isDefault: false
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all questions for a user
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const questions = await Question.find({ userId: userId });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update a specific question
router.put('/user/:userId/:questionId', authMiddleware, async (req, res) => {
  try {
      const userId = req.user._id || req.user.id;
      const { questionId } = req.params;

      if (userId !== req.params.userId) return res.status(403).json({ error: "Unauthorized action" });
      const question = await Question.findById(questionId);

      // Ensure the question exists and belongs to the user
      if (!question || question.userId.toString() !== userId) {
          return res.status(404).json({ error: "Question not found or unauthorized" });
      }

      // Update logic
      const updatedQuestion = await Question.findByIdAndUpdate(
          questionId,
          req.body,
          { new: true }
      );
      res.status(200).json(updatedQuestion);

  } catch (err) {
      console.error("Error updating question:", err.message);
      res.status(400).json({ error: err.message });
  }
});


// Delete a specific question
router.delete('/user/:userId/:questionId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;  // Extract user ID from JWT
    const { questionId } = req.params;

    if (userId !== req.params.userId) {
      return res.status(403).json({ error: "Unauthorized action" });
    }
    const question = await Question.findById(questionId);

    // Ensure the question exists and belongs to the user
    if (!question || question.userId.toString() !== userId) {
      return res.status(404).json({ error: "Question not found or unauthorized" });
    }

    // Deletion logic
    await Question.findByIdAndDelete(questionId);
    res.status(204).json({ message: 'Question deleted' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add an answer to a custom question
router.post('/questions/user/:userId/:questionId/add-answer', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { questionId } = req.params;

    if (!req.body.answer) {
      return res.status(400).json({ error: "Answer is missing or invalid" });
    }

    if (userId !== req.params.userId) {
      return res.status(403).json({ error: "Unauthorized action" });
    }

    const question = await Question.findById(questionId);

    if (!question || (question.userId && question.userId.toString() !== userId)) {
      return res.status(404).json({ error: "Question not found or unauthorized" });
    }

    const newAnswer = new Answer({
      response: req.body.answer,
      userId: userId,
      questionId: question._id
    });
    
    await newAnswer.save();

    question.answers.push(newAnswer._id);
    await question.save();

    res.status(200).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Save a user's answer to a universal question
router.post('/questions/general-answer/:userId/answers', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "UserId is missing from the request." });
  }
  
  const { questionId, answers } = req.body;  // Assume answers are passed as an array
  
  if (!questionId) {
    return res.status(400).json({ error: "QuestionId is missing from the request." });
  }
  
  // Locate the general question by its `_id`
  const question = await Question.findById(questionId);
  
  if (!question || question.isDefault !== true) {
    return res.status(404).json({ error: "General question not found." });
  }

  // Rest of the logic remains the same...
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Here, instead of pushing to responses (assuming you have a field for this in the User model),
    // you can use some logic to update or set the user's response to the specific question.
    // This ensures that a user doesn't answer the same general question multiple times.

    const existingResponseIndex = user.responses.findIndex(response => response.questionId.toString() === questionId);

    if (existingResponseIndex !== -1) {
      user.responses[existingResponseIndex].answers = answers;
    } else {
      user.responses.push({ questionId, answers });
    }
    
    await user.save();
    res.status(201).json(user);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});




// Update an answer for a specific question
router.put('/user/:userId/:questionId/update-answer/:answerIndex', authMiddleware, async (req, res) => {
  try {
      const userId = req.user._id || req.user.id; // Extract user ID from JWT
      const { questionId, answerIndex } = req.params;
      const { updatedAnswer } = req.body;

      // Additional check to ensure logged-in user's ID matches the route's userId
      if (userId !== req.params.userId) {
          return res.status(403).json({ error: "Unauthorized action" });
      }

      const question = await Question.findById(questionId);

      if (!question || question.userId.toString() !== userId) {
          return res.status(404).json({ error: "Question not found or unauthorized" });
      }

      if (answerIndex >= question.answers.length || answerIndex < 0) {
          return res.status(400).json({ error: "Answer index out of bounds" });
      }

      question.answers[answerIndex] = updatedAnswer;
      await question.save();
      res.status(200).json(question);

  } catch (err) {
      res.status(400).json({ error: err.message });
  }
});

// Delete an answer for a specific question
router.delete('/user/:userId/:questionId/delete-answer/:answerIndex', authMiddleware, async (req, res) => {
  try {
      const userId = req.user._id || req.user.id; // Extract user ID from JWT
      const { questionId, answerIndex } = req.params;

      // Additional check to ensure logged-in user's ID matches the route's userId
      if (userId !== req.params.userId) {
          return res.status(403).json({ error: "Unauthorized action" });
      }

      const question = await Question.findById(questionId);

      if (!question || question.userId.toString() !== userId) {
          return res.status(404).json({ error: "Question not found or unauthorized" });
      }

      if (answerIndex >= question.answers.length || answerIndex < 0) {
          return res.status(400).json({ error: "Answer index out of bounds" });
      }

      question.answers.splice(answerIndex, 1);
      await question.save();
      res.status(200).json(question);

  } catch (err) {
      res.status(400).json({ error: err.message });
  }
});



module.exports = router;
