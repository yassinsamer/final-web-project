import React, { useState } from 'react';
import './signup.css'; 

const SignUp = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Prepare the form data for sending to the backend
    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    // Send POST request to the backend for registration
    fetch('http://localhost:555/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || 'Registration failed');
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          console.log('Registration successful:', data.message);
          navigateTo('login');
        } else {
          console.error('Registration failed:', data.error);
          setError(data.error || 'Registration failed');
        }
      })
      .catch((error) => {
        console.error('Registration error:', error);
        setError('Registration failed: ' + error.message);
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />

          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <div className="footer">
          <p>Already have an account? 
            <button onClick={() => navigateTo('login')}>Login</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
