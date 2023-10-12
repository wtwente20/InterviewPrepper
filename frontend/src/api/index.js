import axios from '../axiosConfig';

const api = axios;

// User API calls
export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (userData) => api.post('/users/login', userData);
export const saveUserAnswer = (userId, answerData) => api.post(`/questions/general-answer/${userId}/answers`, answerData);

// Question API calls
export const getQuestions = () => api.get('/questions');
export const createQuestion = (userId, questionData) => api.post(`/questions/user/${userId}/create-question`, questionData);
export const getUserQuestions = (userId) => api.get(`/questions/user/${userId}`);
export const updateUserQuestion = (userId, questionId, updatedData) => api.put(`/questions/user/${userId}/${questionId}`, updatedData);
export const deleteUserQuestion = (userId, questionId) => api.delete(`/questions/user/${userId}/${questionId}`);

