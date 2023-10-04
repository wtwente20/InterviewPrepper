import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, setUser }) {

  // Log whenever Navbar renders with a user state
  console.log("Navbar rendered with user:", user);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <nav>
      <Link to="/">Resources and Tips</Link>
      
      {user ? (
        <>
          <span>Hello, {user.name}!</span>
          <Link to="/questions">Interview Questions</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/performance">Interview Performance</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default React.memo(Navbar);

