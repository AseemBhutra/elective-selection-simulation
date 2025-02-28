import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProgramSelection.css';

function ProgramSelection() {
  const navigate = useNavigate();

  const handleProgramSelect = (program) => {
    if (program === 'PGPM') {
      navigate('/pgpm');
    } else {
      navigate('/pgdm');
    }
  };

  return (
    <div className="program-selection-container">
      <div className="program-selection-content">
        <h1>Select Your Program</h1>
        <div className="program-buttons">
          <button 
            className="program-button"
            onClick={() => handleProgramSelect('PGPM')}
          >
            PGPM
          </button>
          <button 
            className="program-button"
            onClick={() => handleProgramSelect('PGDM')}
          >
            PGDM
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProgramSelection;