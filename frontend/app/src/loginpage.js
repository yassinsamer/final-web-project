import React, { useState } from 'react';
import './login.css';  

const LoginPage = ({ onLogin, navigateTo }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    
    const loginData = {
      email: username,  // assuming username is the email for login
      password: password,
    };

    // Send POST request to the backend
    fetch('http://localhost:555/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject('Login failed');
      })
      .then((data) => {
        console.log('Login successful:', data);
        onLogin(username); // Pass the username to the onLogin handler to store in the app state
        navigateTo('home'); 
      })
      .catch((error) => {
        console.error('Login error:', error);
        alert('Login failed: ' + error);
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login to Your Account</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="footer">
          <p>
            Don't have an account?{' '}
            <button onClick={() => navigateTo('signup')}>Sign up here</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
