import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAnalytics } from './hooks/useFirebaseAnalytics';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();
  const logAnalyticsEvent = useFirebaseAnalytics();
  const [showModal, setShowModal] = useState(false);

  const handleStartSimulation = () => {
    setShowModal(true); // Show disclaimer popup
  };

  const handleProceed = () => {
    logAnalyticsEvent('start_simulation', { entry_point: 'welcome_screen' });
    setShowModal(false);
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
      
      {/* Disclaimer Popup */}
      {showModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>⚠️ Disclaimer</h2>
      <p>
        This tool helps you explore elective choices but does <strong>not</strong> finalize your selection.
      </p>
      <p>
        To confirm your electives, submit the official <strong>Google Form</strong> provided by the <strong>Program Office (PO)</strong>.
      </p>
      <div className="modal-buttons">
        <button className="proceed-btn" onClick={handleProceed}>I Understand</button>
        <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

export default Welcome;