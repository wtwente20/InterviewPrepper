import axios from 'axios';
import React, { useState } from 'react';

function QuestionCard({ question, user, editable, onQuestionUpdate, onQuestionDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [editedAnswers, setEditedAnswers] = useState('');

  const toggleEdit = () => {
    if (isEditing) {
      setEditedText('');
      setEditedAnswers('');
    } else {
      setEditedText(question.questionText);
      setEditedAnswers(question.answers.join(', '));
    }
    setIsEditing(prev => !prev);
  };

  const handleEditSubmit = async () => {
    try {
      const updatedQuestion = {
        questionText: editedText,
        answers: editedAnswers.split(',').map(answer => answer.trim())
      };
      const response = await axios.put(`/api/questions/user/${user._id}/${question._id}`, updatedQuestion);
      onQuestionUpdate(response.data);
      toggleEdit();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/questions/user/${user._id}/${question._id}`);
      onQuestionDelete(question._id);
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  return (
    <div className="question-card">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          <input
            type="text"
            value={editedAnswers}
            onChange={(e) => setEditedAnswers(e.target.value)}
          />
          <button onClick={handleEditSubmit}>Save</button>
          <button onClick={toggleEdit}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{question.questionText}</h4>
          <ul>
            {question.answers.map((answer, index) => (
              <li key={index}>{answer}</li>
            ))}
          </ul>
          {editable && (
            <>
              <button onClick={toggleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default QuestionCard;
