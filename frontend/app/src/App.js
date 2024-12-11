import React from 'react';
import './App.css';        // Optional global styles (if any)
import LoginPage from './loginpage';  // Import the LoginPage component

function App() {
  return (
    <div className="App">
      <LoginPage />  {/* Render the LoginPage component */}
    </div>
  );
}

export default App;
