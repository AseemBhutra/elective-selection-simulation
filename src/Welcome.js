import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();

  const handleStartSimulation = () => {
    navigate('/courses');
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Welcome to Elective Selection Simulator</h1>
        <p className="welcome-subtitle">Plan your academic journey and make informed decisions</p>
        <button className="primary-button" onClick={handleStartSimulation}>
          Get Started →
        </button>
      </div>
    </div>
  );
}

export default Welcome; 