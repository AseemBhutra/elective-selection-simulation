import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAnalytics } from './hooks/useFirebaseAnalytics';
import './ProgramSelection.css';

function ProgramSelection() {
  const navigate = useNavigate();
  const logAnalyticsEvent = useFirebaseAnalytics();

  const handleProgramSelect = (program) => {
    logAnalyticsEvent('program_selected', {
      program_type: program,
      selection_timestamp: new Date().toISOString()
    });
    
    navigate(`/${program.toLowerCase()}`);
  };

  return (
    <div className="program-selection-container">
      <div className="program-selection-content">
        <h1 className="animate fade-in-down">Select Your Program</h1>
        <div className="program-buttons">
          <button 
            className="program-button animate fade-in-up delay-1"
            onClick={() => handleProgramSelect('PGPM')}
            aria-label="Select PGPM program"
          >
            PGPM
          </button>
          <button 
            className="program-button animate fade-in-up delay-2"
            onClick={() => handleProgramSelect('PGDM')}
            aria-label="Select PGDM program"
          >
            PGDM
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProgramSelection;