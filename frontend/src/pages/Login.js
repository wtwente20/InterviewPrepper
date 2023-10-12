import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import the useNavigate hook
import axios from '../axiosConfig';

function Login({ setUser }) {
  console.log("setUser in Login:", setUser);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();  // <-- Instantiate the navigate function

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
        const response = await axios.post('/api/users/login', formData);
        
        console.log("Server response after login:", response.data);

        const { token, user } = response.data;  // Extract both token and user from the response
        localStorage.setItem('authToken', token);
        console.log('Stored token:', localStorage.getItem('authToken')); // Ensure token is received on front end
        setUser(user);  // Set the user in state using the user data from the response
        
        console.log("Navigating to root after login");
        navigate('/');
    } catch (err) {
        console.error("Error during login:", err); // Log the full error object
        const errorMessage = err.response ? err.response.data : 'Unexpected error';
        setError(errorMessage);
    }
};



  return (
    <div className="login">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
