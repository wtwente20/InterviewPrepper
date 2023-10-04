import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import QuestionCard from '../components/questionCard';

function Questions({ user }) {
  const [questions, setQuestions] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionAnswers, setNewQuestionAnswers] = useState('');

  useEffect(() => {
    const fetchDefaultQuestions = async () => {
      try {
        const response = await axios.get('/api/questions');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching default questions:', error);
      }
    };

    const fetchUserQuestions = async () => {
      if (user) {
        try {
          const response = await axios.get(`/api/questions/user/${user._id}`);
          setUserQuestions(response.data);
        } catch (error) {
          console.error('Error fetching user questions:', error);
        }
      }
    };

    fetchDefaultQuestions();
    fetchUserQuestions();
  }, [user]);

  const handleQuestionUpdate = (updatedQuestion) => {
    setUserQuestions(prev => prev.map(q => q._id === updatedQuestion._id ? updatedQuestion : q));
  };

  const handleQuestionDelete = (questionId) => {
    setUserQuestions(prev => prev.filter(q => q._id !== questionId));
  };

  const addNewQuestion = async () => {
    try {
      const response = await axios.post('/api/questions', {
        questionText: newQuestionText,
        answers: newQuestionAnswers.split(',').map(answer => answer.trim()),
        userId: user._id,
        isDefault: false
      });
      setUserQuestions([...userQuestions, response.data]);
      setNewQuestionText('');
      setNewQuestionAnswers('');
    } catch (error) {
      console.error('Error adding new question:', error);
    }
  };

  return (
    <div className="questions">
      <h2>Interview Questions</h2>
      
      <h3>Default Questions</h3>
      {questions.map((question) => (
        <QuestionCard key={question._id} question={question} />
      ))}

      {user && (
        <>
          <h3>Your Custom Questions</h3>
          {userQuestions.map((question) => (
            <QuestionCard
              key={question._id}
              question={question}
              editable={true}
              onQuestionUpdate={handleQuestionUpdate}
              onQuestionDelete={handleQuestionDelete}
            />
          ))}
          <div className="add-question">
            <input
              type="text"
              placeholder="New question text..."
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
            />
            <input
              type="text"
              placeholder="Possible answers (comma separated)..."
              value={newQuestionAnswers}
              onChange={(e) => setNewQuestionAnswers(e.target.value)}
            />
            <button onClick={addNewQuestion}>Add Question</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Questions;
