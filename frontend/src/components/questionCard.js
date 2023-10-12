import React, { useState } from 'react';
import axios from '../axiosConfig';

function QuestionCard({ question, user, editable, onQuestionUpdate, onQuestionDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [editedAnswers, setEditedAnswers] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editAnswerIndex, setEditAnswerIndex] = useState(null);
  const [editAnswerText, setEditAnswerText] = useState('');

  const isDefaultQuestion = question.isDefault;

  const toggleEdit = () => {
    if (isEditing) {
        setEditedText('');
        setEditedAnswers('');
    } else {
        setEditedText(question.questionText);
        setEditedAnswers(question.answers.map(ans => ans.response).join(', '));
    }
    setIsEditing(prev => !prev);
};

const startEditingAnswer = (index, answerText) => {
  setEditAnswerIndex(index);
  setEditAnswerText(answerText);
};

const stopEditingAnswer = () => {
  setEditAnswerIndex(null);
  setEditAnswerText('');
};

  const token = localStorage.getItem('authToken');

  const axiosConfig = {
    headers: {
      'auth-token': token
    }
  };

  const handleEditSubmit = async () => {
    try {
      const updatedQuestion = {
        questionText: editedText,
        answers: editedAnswers.split(',').map(answer => answer.trim())
      };
      const response = await axios.put(`/api/questions/user/${user._id}/${question._id}`, updatedQuestion, axiosConfig);
      onQuestionUpdate(response.data);
      toggleEdit();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/questions/user/${user._id}/${question._id}`, axiosConfig);
      onQuestionDelete(question._id);
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleAddAnswer = async () => {
    try {
        if (!newAnswer.trim()) return;

        let endpoint;
        if (isDefaultQuestion) {
            endpoint = `/api/general-answer/${user._id}/answers`;
        } else {
            endpoint = `/api/questions/user/${user._id}/${question._id}/add-answer`;
        }

        const response = await axios.post(endpoint, { answer: newAnswer, questionId: question._id }, axiosConfig);

        onQuestionUpdate(response.data);
        setNewAnswer('');
    } catch (error) {
        console.error('Error adding new answer:', error.response.data);
    }
};


  const handleUpdateAnswer = async () => {
    try {
      const response = await axios.put(`/api/questions/user/${user._id}/${question._id}/update-answer/${editAnswerIndex}`, {
          updatedAnswer: editAnswerText
      }, axiosConfig);
      onQuestionUpdate(response.data);
      stopEditingAnswer();
    } catch (error) {
      console.error('Error updating answer:', error);
    }
  };

  const handleDeleteAnswer = async (answerIndex) => {
    try {
      const response = await axios.delete(`/api/questions/user/${user._id}/${question._id}/delete-answer/${answerIndex}`, axiosConfig);
      onQuestionUpdate(response.data);
    } catch (error) {
      console.error('Error deleting answer:', error);
    }
  };

  return (
    <div className="question-card">
        {/*... rest of the component ...*/}
        <>
            <h4>{question.questionText}</h4>
            <ul>
                {Array.isArray(question.answers) && question.answers.map((answer, index) => (
                    <li key={answer._id || index}>
                        {index === editAnswerIndex ? (
                            <>
                                <input
                                    type="text"
                                    value={editAnswerText}
                                    onChange={e => setEditAnswerText(e.target.value)}
                                />
                                <button onClick={handleUpdateAnswer}>Save</button>
                                <button onClick={stopEditingAnswer}>Cancel</button>
                            </>
                        ) : (
                                <>
                                    {answer.response}
                                    {editable && (
                                        <>
                                            <button onClick={() => startEditingAnswer(index, answer.response)}>Edit</button>
                                            <button onClick={() => handleDeleteAnswer(index)}>Delete</button>
                                        </>
                                    )}
                                </>
                            )}
                    </li>
                ))}
            </ul>
            {editable && (
                <>
                    <button onClick={toggleEdit}>Edit Question</button>
                    <button onClick={handleDelete}>Delete Question</button>
                </>
            )}
        </>
        <div className="answer-section">
            <input
                type="text"
                placeholder="Add your answer..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
            />
            <button onClick={handleAddAnswer}>Add Answer</button>
        </div>
    </div>
  );
}

export default QuestionCard;
