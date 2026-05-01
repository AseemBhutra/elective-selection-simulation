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
      <div className="welcome-bg-grid" aria-hidden="true" />
      <div className="welcome-bg-blob welcome-bg-blob--1" aria-hidden="true" />
      <div className="welcome-bg-blob welcome-bg-blob--2" aria-hidden="true" />

      <main className="welcome-shell">
        <section className="welcome-hero">
          <span className="welcome-eyebrow animate fade-in-down">
            <span className="welcome-eyebrow-dot" />
            Academic Planning, Reimagined
          </span>

          <h1 className="welcome-title animate fade-in-down delay-1">
            Design your <span className="welcome-title-accent">specialization</span> with clarity.
          </h1>

          <p className="welcome-subtitle animate fade-in delay-2">
            Explore elective combinations, see your specialization outcome in real time, and
            plan your academic journey with confidence.
          </p>

          <div className="welcome-cta animate fade-in-up delay-3">
            <button className="welcome-primary-btn" onClick={handleStartSimulation}>
              Get Started
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="welcome-cta-hint">No sign-in required · Takes ~2 minutes</span>
          </div>
        </section>

        <section className="welcome-feature-grid animate fade-in-up delay-3">
          <article className="welcome-feature-card">
            <div className="welcome-feature-icon welcome-feature-icon--blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <h3>Live Outcomes</h3>
            <p>See your specialization update instantly as you pick electives.</p>
          </article>

          <article className="welcome-feature-card">
            <div className="welcome-feature-icon welcome-feature-icon--amber">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" stroke="currentColor" strokeWidth="2"
                  strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Smart Validation</h3>
            <p>Prerequisites and program rules checked automatically.</p>
          </article>

          <article className="welcome-feature-card">
            <div className="welcome-feature-icon welcome-feature-icon--green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
                  stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M14 3v5h5M9 14l2 2 4-4" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Exportable Report</h3>
            <p>Download a clean summary of your selection in one click.</p>
          </article>
        </section>
      </main>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal-content">
            <h2>Disclaimer</h2>
            <p>
              This tool helps you <strong>explore</strong> elective choices but does{' '}
              <strong>not</strong> finalize your selection.
            </p>
            <p>
              To confirm your electives, submit the official <strong>Google Form</strong> provided
              by the <strong>Program Office</strong>.
            </p>
            <div className="modal-buttons">
              <button className="proceed-btn" onClick={handleProceed}>
                I Understand, Continue
              </button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Welcome;