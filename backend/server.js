const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const questionsRoutes = require('./routes/questionRoutes');
const defaultQuestions = require('./data/defaultQuestions');
const Question = require('./models/question');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies from requests
app.use(express.json());

// MongoDB Connection
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cihqald.mongodb.net/myapp?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
    console.log('MongoDB Connected');
    
    const questionCount = await Question.countDocuments();
    if (questionCount === 0) {
      const questionsWithDefaultFlag = defaultQuestions.map(question => ({
        ...question,
        isDefault: true,
      }));
      await Question.insertMany(questionsWithDefaultFlag);
      console.log('Inserted default questions');
    }
})
.catch(err => console.log(err));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/questions', questionsRoutes);

// Server Listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
