import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import axios from './axiosConfig';
import Navbar from './components/navbar';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import Performance from './pages/Performance';
import Questions from './pages/Questions';
import Register from './pages/Register';
import Resources from './pages/Resources';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
        console.log("Fetching user data...");  // <-- Add logging here

        const token = localStorage.getItem('authToken');
        
        if (token) {
            try {
                const response = await axios.get('/api/users/me', {
                    headers: {
                        'auth-token': token
                    }
                });
                
                console.log("User data fetched:", response.data);  // <-- Add logging here

                setUser(response.data);  // Set user data after successful token validation
            } catch (error) {
                console.error('Token validation failed:', error);
                // Handle the error, e.g., remove the invalid token from local storage
                localStorage.removeItem('authToken');
            }
        } else {
            console.log("No token found in local storage.");  // <-- Add logging here if no token
        }
    };

    fetchUserData();
}, []);

    useEffect(() => {
      console.log("User state changed:", user);
    }, [user]);


  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Resources />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/questions" element={<Questions user={user} />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/performance" element={<Performance />} />
        {/* ... other routes */}
      </Routes>
    </Router>
  );
}

export default App;
