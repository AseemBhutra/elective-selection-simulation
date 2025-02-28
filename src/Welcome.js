import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAnalytics } from './hooks/useFirebaseAnalytics';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();
  const logAnalyticsEvent = useFirebaseAnalytics();

  const handleStartSimulation = () => {
    logAnalyticsEvent('start_simulation', {
      entry_point: 'welcome_screen'
    });
    navigate('/courses');
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="animate fade-in-down">Welcome to Elective Selection Simulator</h1>
        <p className="welcome-subtitle animate fade-in delay-1">
          Make informed decisions about your academic journey
        </p>
        <button 
          className="primary-button animate fade-in-up delay-2"
          onClick={handleStartSimulation}
        >
          Get Started →
        </button>
      </div>
    </div>
  );
}

export default Welcome; 