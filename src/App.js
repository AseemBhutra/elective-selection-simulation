import React, { useState } from "react";
import "./App.css"; // Import the CSS file for styling

const electivesData = {
  4: [
    { name: "Product & Brand Management", major: "Marketing", color: "#FF9999" },
    { name: "Digital Marketing", major: "Marketing, Digital Strategy", color: "#FF9999", crossListed: true },
    { name: "Consumer Behaviour", major: "Marketing", color: "#FF9999" },
    { name: "Financial Modelling and Valuation", major: "Finance", color: "#99FF99" },
    { name: "Security Analysis & Portfolio Management", major: "Finance", color: "#99FF99" },
    { name: "Enterprise Resources Planning", major: "Operations, Digital Strategy", color: "#FFFF99", crossListed: true },
    { name: "Digital Enterprise Strategy", major: "Digital Strategy, Operations", color: "#9999FF", crossListed: true },
    { name: "Machine Learning I", major: "Analytics", color: "#FFCC99" },
    { name: "Web and Social Media Analytics", major: "Analytics", color: "#FFCC99" },
    { name: "Project Management", major: "Operations", color: "#FFFF99" }
  ],
  5: [
    { name: "Marketing & Retail Analytics", major: "Marketing, Analytics", color: "#FF9999", crossListed: true },
    { name: "Advanced Digital Marketing", major: "Marketing, Digital Strategy", color: "#FF9999", crossListed: true },
    { name: "Fintech", major: "Finance, Digital Strategy", color: "#99FF99", crossListed: true },
    { name: "Strategic Sourcing and Procurement", major: "Operations", color: "#FFFF99" },
    { name: "Supply Chain Modeling and Analysis", major: "Operations", color: "#FFFF99" },
    { name: "Design Thinking", major: "Digital Strategy, Open Electives", color: "#9999FF", crossListed: true },
    { name: "Emotional Intelligence for Leadership", major: "Open Electives", color: "#CCCCCC" },
    { name: "Machine Learning II", major: "Analytics", color: "#FFCC99" },
    { name: "B2B Marketing", major: "Marketing", color: "#FF9999" }
  ],
  6: [
    { name: "Customer Relationship Management", major: "Marketing", color: "#FF9999" },
    { name: "Financial Inclusion and Microfinance", major: "Finance", color: "#99FF99" },
    { name: "Service Operations Management", major: "Operations", color: "#FFFF99" },
    { name: "Deep Learning & AI", major: "Analytics", color: "#FFCC99" },
    { name: "Technology Product Management", major: "Digital Strategy, Open Electives", color: "#9999FF", crossListed: true },
    { name: "Negotiation and Bargaining", major: "Open Electives", color: "#CCCCCC" },
    { name: "Spatial Computing in Marketing", major: "Marketing, Digital Strategy", color: "#FF9999", crossListed: true },
    { name: "Big Data & Cloud Analytics", major: "Analytics, Digital Strategy", color: "#FFCC99", crossListed: true },
    { name: "Financial Risk Analytics", major: "Finance, Analytics", color: "#99FF99", crossListed: true },
    { name: "Demand Planning & Forecasting", major: "Operations", color: "#FFFF99" }
  ],
  7: [
    { name: "Services Marketing", major: "Marketing", color: "#FF9999" },
    { name: "Mergers & Acquisitions", major: "Finance", color: "#99FF99" },
    { name: "Business Excellence for Competitive Advantage", major: "Operations", color: "#FFFF99" },
    { name: "Natural Language Processing", major: "Analytics", color: "#FFCC99" },
    { name: "Game Theory", major: "Open Electives", color: "#CCCCCC" },
    { name: "HR Analytics", major: "Analytics, Open Electives", color: "#FFCC99", crossListed: true },
    { name: "Personal and Behavioral Finance", major: "Finance", color: "#99FF99" },
    { name: "Alternative Investments (0.5 credit)", major: "Finance", color: "#99FF99" },
    { name: "Business Ethics in Practice", major: "Open Electives", color: "#CCCCCC" }
  ]
};

const termLimits = {
  4: { min: 3, max: 5 },
  5: { min: 3, max: 5 },
  6: { min: 3, max: 4 },
  7: { min: 2, max: 3 }
};

function App() {
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [selectedElectives, setSelectedElectives] = useState({ 4: [], 5: [], 6: [], 7: [] });
  const [popup, setPopup] = useState({ visible: false, elective: null, term: null });
  const [messagePopup, setMessagePopup] = useState({ visible: false, message: "" });
  

  const handleStartSimulation = () => {
    setSimulationStarted(true);
  };

  const handleResetSimulation = () => {
    setSelectedElectives({ 4: [], 5: [], 6: [], 7: [] });
  };

  const handleSelectElective = (term, elective) => {
    if (elective.crossListed) {
      setPopup({ visible: true, elective, term });
    } else {
      toggleElectiveSelection(term, elective);
    }
  };

  const showMessagePopup = (message) => {
    setMessagePopup({ visible: true, message });
  };

  const toggleElectiveSelection = (term, elective) => {
    setSelectedElectives((prev) => {
      const updatedSelection = { ...prev };

      // Check if the elective is already selected in the current term
      const isSelected = updatedSelection[term].find((item) => item.name === elective.name);

      if (isSelected) {
        // Deselect the elective
        updatedSelection[term] = updatedSelection[term].filter((item) => item.name !== elective.name);
      } else {
        // Check term limits
        if (updatedSelection[term].length >= termLimits[term].max) {
          showMessagePopup(`You can select a maximum of ${termLimits[term].max} electives for Term ${term}.`);
          return updatedSelection;
        }

        // Check total selection limit (14 electives)
        const totalSelected = Object.values(updatedSelection).flat().length;
        if (totalSelected >= 14) {
          showMessagePopup("You have reached the maximum limit of 14 electives.");
          return updatedSelection;
        }

        // Add the elective to the current term
        updatedSelection[term] = [...updatedSelection[term], elective];
      }

      return updatedSelection;
    });
  };

  const handlePopupSelection = (category) => {
    const { elective, term } = popup;
    const updatedElective = { ...elective, major: category, color: getColorForCategory(category) };
    toggleElectiveSelection(term, updatedElective);
    setPopup({ visible: false, elective: null, term: null });
  };

  const getColorForCategory = (category) => {
    switch (category) {
      case "Finance":
        return "#99FF99";
      case "Digital Strategy":
        return "#9999FF";
      case "Marketing":
        return "#FF9999";
      case "Operations":
        return "#FFFF99";
      case "Analytics":
        return "#FFCC99";
      case "Open Electives":
        return "#CCCCCC";
      default:
        return "#e0e0e0";
    }
  };

  const determineMajorMinor = () => {
    const counts = {};

    // Count the number of courses in each area
    Object.values(selectedElectives).flat().forEach((elective) => {
      const majors = elective.major.split(",");
      majors.forEach((major) => {
        counts[major.trim()] = (counts[major.trim()] || 0) + 1;
      });
    });

    // Define thresholds
    const MAJOR_THRESHOLD = 6; // At least 6 courses for a major
    const MINOR_THRESHOLD = 4; // At least 4 courses for a minor
    const GENERAL_MANAGEMENT_THRESHOLD = 2; // At least 2 courses in each area for general management

    // List of functional areas
    const functionalAreas = ["Marketing", "Finance", "Operations", "Analytics", "Digital Strategy", "Open Electives"];

    // Check for General Management
    const isGeneralManagement = functionalAreas.every((area) => (counts[area] || 0) >= GENERAL_MANAGEMENT_THRESHOLD);

    // Check for Majors and Minors
    const majorAreas = Object.entries(counts)
      .filter(([_, count]) => count >= MAJOR_THRESHOLD)
      .map(([area]) => area);

    const minorAreas = Object.entries(counts)
      .filter(([area, count]) => count >= MINOR_THRESHOLD && !majorAreas.includes(area))
      .map(([area]) => area);

    // Determine the outcome
    if (isGeneralManagement) {
      return "General Management (2 courses in each functional area)";
    } else if (majorAreas.length >= 2) {
      return `Double Major: ${majorAreas[0]} and ${majorAreas[1]}`;
    } else if (majorAreas.length === 1 && minorAreas.length >= 1) {
      return `Major: ${majorAreas[0]}, Minor: ${minorAreas[0]}`;
    } else if (majorAreas.length === 1) {
      return `Major: ${majorAreas[0]}`;
    } else if (minorAreas.length >= 1) {
      return `Minor: ${minorAreas[0]}`;
    } else {
      return "No major or minor yet. Keep selecting courses.";
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-container") {
      setPopup({ visible: false, elective: null, term: null });
      setMessagePopup({ visible: false, message: "" });
    }
  };

  const handleCheck = () => {
    let validationErrors = [];

    // Check total number of selected electives
    const totalSelected = Object.values(selectedElectives).flat().length;
    if (totalSelected !== 14) {
      validationErrors.push(`Missing ${14 - totalSelected} electives`);
    }

    // Check for at least one open elective
    const hasOpenElective = Object.values(selectedElectives)
      .flat()
      .some(elective => elective.major.includes("Open Electives"));
    
    if (!hasOpenElective) {
      validationErrors.push("Must select at least one Open Elective course");
    }

    // Check term limits
    for (const term in termLimits) {
      const selectedCount = selectedElectives[term].length;
      if (selectedCount < termLimits[term].min) {
        validationErrors.push(`Term ${term}: Add ${termLimits[term].min - selectedCount} more electives`);
      } else if (selectedCount > termLimits[term].max) {
        validationErrors.push(`Term ${term}: Remove ${selectedCount - termLimits[term].max} electives`);
      }
    }

    // Check major/minor requirements
    const outcome = determineMajorMinor();
    if (outcome.startsWith("Minor:") && !outcome.includes("Major:")) {
      validationErrors.push("Need 2 more courses in your strongest area to complete a major");
    } else if (outcome.startsWith("No major")) {
      validationErrors.push("Need 6 courses in one area to complete a major");
    }

    if (validationErrors.length > 0) {
      setMessagePopup({
        visible: true,
        type: 'error',
        title: 'Required Changes:',
        message: validationErrors
      });
    } else {
      setMessagePopup({
        visible: true,
        type: 'success',
        title: 'Valid Selection',
        message: [`${outcome}`]
      });
    }
  };

  const totalSelectedElectives = Object.values(selectedElectives).flat().length;

  if (!simulationStarted) {
    return (
      <div className="start-screen">
        <h1>Welcome to Elective Selection Simulation</h1>
        <button className="start-button" onClick={handleStartSimulation}>
          Start Simulation
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Elective Selection Simulation</h1>
        <div className="header-controls">
          <button className="primary-button" onClick={handleCheck}>
            Validate Selection
          </button>
          <button className="secondary-button" onClick={handleResetSimulation}>
            Reset
          </button>
        </div>
      </header>

      <div className="main-content">
        {/* Left Panel - Term-Wise Selection */}
        <div className="terms-container">
          {Object.keys(electivesData).map((term) => (
            <div key={term} className="term-section">
              <div className="term-header">
                <h2>Term {term}</h2>
                <span className="term-count">
                  {selectedElectives[term].length} / {termLimits[term].max} selected
                </span>
              </div>
              <div className="electives-grid">
                {electivesData[term].map((elective) => {
                  const isSelected = selectedElectives[term].find((e) => e.name === elective.name);
                  const color = isSelected ? isSelected.color : "#e0e0e0";
                  return (
                    <div
                      key={elective.name}
                      className={`elective-tile ${isSelected ? "selected" : ""} ${elective.crossListed ? "cross-listed" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleSelectElective(parseInt(term), elective)}
                    >
                      <span className="elective-name">{elective.name}</span>
                      {elective.crossListed && <span className="cross-listed-badge">Cross-listed</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel - Dashboard */}
        <div className="dashboard">
          <div className="progress-section">
            <h2>Selection Progress</h2>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(totalSelectedElectives / 14) * 100}%` }}
              />
            </div>
            <div className="progress-stats">
              <div>
                <span className="progress-text">
                  {totalSelectedElectives} of 14
                </span>
                <div className="progress-label">Electives Selected</div>
              </div>
              <div>
                <span className="progress-text">
                  {14 - totalSelectedElectives}
                </span>
                <div className="progress-label">Remaining</div>
              </div>
            </div>
          </div>

          <div className="outcome-section">
            <h2>Current Outcome</h2>
            <div className="outcome-card">
              {determineMajorMinor()}
            </div>
          </div>

          <div className="legend-section">
            <h2>Major Categories</h2>
            <div className="legend-grid">
              {[
                { name: "Finance", color: "#99FF99" },
                { name: "Digital Strategy", color: "#9999FF" },
                { name: "Marketing", color: "#FF9999" },
                { name: "Operations", color: "#FFFF99" },
                { name: "Analytics", color: "#FFCC99" },
                { name: "Open Electives", color: "#CCCCCC" }
              ].map(category => (
                <div key={category.name} className="legend-item">
                  <span className="color-dot" style={{ backgroundColor: category.color }}></span>
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popup for Cross-Listed Courses */}
      {popup.visible && (
        <div
          id="popup-container"
          className="popup-overlay"
          onClick={handleOutsideClick}
        >
          <div className="popup-content">
            <h3>Select Category for {popup.elective.name}</h3>
            <p>This course is cross-listed. Please choose the category you want to count it toward:</p>
            {popup.elective.major.split(",").map((category) => (
              <button
                key={category}
                className="category-button"
                style={{ backgroundColor: getColorForCategory(category.trim()) }}
                onClick={() => handlePopupSelection(category.trim())}
              >
                {category.trim()}
              </button>
            ))}
            <button
              className="cancel-button"
              onClick={() => setPopup({ visible: false, elective: null, term: null })}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Popup for Messages */}
      {messagePopup.visible && (
        <div
          id="popup-container"
          className="popup-overlay"
          onClick={handleOutsideClick}
        >
          <div className={`popup-content ${messagePopup.type}`}>
            <h3 className={`popup-title ${messagePopup.type}`}>
              {messagePopup.title}
            </h3>
            <div className="popup-message-container">
              {Array.isArray(messagePopup.message) ? (
                <ul className="validation-list">
                  {messagePopup.message.map((msg, index) => (
                    <li key={index} className="validation-item">
                      {msg}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{messagePopup.message}</p>
              )}
            </div>
            <button
              className="close-button"
              onClick={() => setMessagePopup({ visible: false, message: "" })}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;