import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

function Register({ setUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);  // New state variable for registration success

  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await axios.post('/api/users/register', formData);

      setRegistrationSuccess(true);  // Set registration success state to true

      // Redirect to login after a short delay of 1.5 seconds
      setTimeout(() => {
        navigate('/login');  
      }, 1500);  

    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="register">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      {registrationSuccess && <p className="success">Registration successful! Redirecting to login...</p>}  {/* Display success message when registration is successful */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
