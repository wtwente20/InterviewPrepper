const express = require('express');
const router = express.Router();
const Question = require('../models/question');

// Get universal questions
router.get('/', async (req, res) => {
  try {
    console.log("Fetching questions from database..."); // Debug Log
    const questions = await Question.find();
    console.log("Questions fetched:", questions); // Debug Log
    res.json(questions);
  } catch (err) {
    console.log("Error fetching questions:", err.message); // Debug Log
    res.status(500).json({ message: err.message });
  }
});


// Create a new question
router.post('/', async (req, res) => {
  try {
    const { questionText, answers, userId, isDefault } = req.body;

    // Ensure the userId is provided for user-specific questions
    if (!userId && !isDefault) return res.status(400).json({ error: "User ID is required for creating questions" });

    const newQuestion = new Question({
      questionText,
      answers,
      userId,
      isDefault,
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all questions for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const questions = await Question.find({ userId: req.params.userId });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update a specific question
router.put('/user/:userId/:questionId', async (req, res) => {
  try {
    const { userId, questionId } = req.params;
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
    res.status(400).json({ error: err.message });
  }
});


// Delete a specific question
router.delete('/user/:userId/:questionId', async (req, res) => {
  try {
    const { userId, questionId } = req.params;
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


module.exports = router;
