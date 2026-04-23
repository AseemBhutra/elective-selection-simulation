import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAnalytics } from './hooks/useFirebaseAnalytics';
import './ProgramSelection.css';

const programs = [
  {
    id: 'PGPM',
    title: 'PGPM',
    subtitle: 'Post Graduate Programme in Management',
    terms: '4 terms (Term 4–7)',
    electives: '14 electives',
    areas: 'Analytics, Digital Strategy, Finance, Marketing, Operations',
  },
  {
    id: 'PGDM',
    title: 'PGDM',
    subtitle: 'Post Graduate Diploma in Management',
    terms: '3 terms (Term 4–6)',
    electives: '11 electives',
    areas: 'Analytics, Finance, HR, Marketing, Operations',
  },
];

function ProgramSelection() {
  const navigate = useNavigate();
  const logAnalyticsEvent = useFirebaseAnalytics();

  const handleProgramSelect = (program) => {
    logAnalyticsEvent('program_selected', {
      program_type: program,
      selection_timestamp: new Date().toISOString(),
    });
    navigate(`/${program.toLowerCase()}`);
  };

  return (
    <div className="program-selection-container">
      <div className="program-selection-content">
        <button className="ps-back-btn" onClick={() => navigate('/')} aria-label="Back to welcome">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <h1 className="animate fade-in-down">Choose Your Program</h1>
        <p className="ps-subtitle animate fade-in delay-1">Select the program you're enrolled in to start simulating your elective selection.</p>
        <div className="program-cards">
          {programs.map((prog, i) => (
            <button
              key={prog.id}
              className={`program-card animate fade-in-up delay-${i + 2}`}
              onClick={() => handleProgramSelect(prog.id)}
              aria-label={`Select ${prog.title} program`}
            >
              <span className="card-title">{prog.title}</span>
              <span className="card-subtitle">{prog.subtitle}</span>
              <div className="card-details">
                <div className="card-detail">
                  <span className="detail-label">Terms</span>
                  <span className="detail-value">{prog.terms}</span>
                </div>
                <div className="card-detail">
                  <span className="detail-label">Electives</span>
                  <span className="detail-value">{prog.electives}</span>
                </div>
                <div className="card-detail">
                  <span className="detail-label">Specializations</span>
                  <span className="detail-value">{prog.areas}</span>
                </div>
              </div>
              <span className="card-cta">Start Simulation →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgramSelection;