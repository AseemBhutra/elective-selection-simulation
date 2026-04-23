import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAnalytics } from './hooks/useFirebaseAnalytics';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();
  const logAnalyticsEvent = useFirebaseAnalytics();
  const [showModal, setShowModal] = useState(false);

  const handleStartSimulation = () => {
    setShowModal(true);
  };

  const handleProceed = () => {
    logAnalyticsEvent('start_simulation', { entry_point: 'welcome_screen' });
    setShowModal(false);
    navigate('/courses');
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-icon">📚</div>
        <h1 className="animate fade-in-down">Elective Selection Simulator</h1>
        <p className="welcome-subtitle animate fade-in delay-1">
          Explore elective combinations, see your specialization outcome in real-time, and plan your academic journey with confidence.
        </p>
        <div className="welcome-features animate fade-in delay-2">
          <div className="welcome-feature">
            <span className="feature-icon">🎯</span>
            <span>See specialization outcomes live</span>
          </div>
          <div className="welcome-feature">
            <span className="feature-icon">⚡</span>
            <span>Prerequisite &amp; rule validation</span>
          </div>
          <div className="welcome-feature">
            <span className="feature-icon">📄</span>
            <span>Download your selection report</span>
          </div>
        </div>
        <button 
          className="primary-button animate fade-in-up delay-3"
          onClick={handleStartSimulation}
        >
          Get Started
        </button>
      </div>
      
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content">
            <h2>Disclaimer</h2>
            <p>
              This tool helps you <strong>explore</strong> elective choices but does <strong>not</strong> finalize your selection.
            </p>
            <p>
              To confirm your electives, submit the official <strong>Google Form</strong> provided by the <strong>Program Office</strong>.
            </p>
            <div className="modal-buttons">
              <button className="proceed-btn" onClick={handleProceed}>I Understand, Continue</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Welcome;