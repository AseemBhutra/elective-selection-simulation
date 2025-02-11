import React, { useState, useEffect } from "react";
import "./App.css"; // Import the CSS file for styling
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "your-app-id",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "your-measurement-id"
};

const electivesData = {
  4: [
    { name: "Machine Learning I", major: "Analytics", color: "#FFCC99" },
    { name: "Web and Social Media Analytics", major: "Analytics", color: "#FFCC99" },
    { name: "Digital Marketing", major: "Digital Strategy, Marketing", color: "#FF9999", crossListed: true },
    { name: "Digital Enterprise Strategy", major: "Digital Strategy, Operations", color: "#9999FF", crossListed: true },
    { name: "Enterprise Resources Planning", major: "Digital Strategy, Operations", color: "#FFFF99", crossListed: true },
    { name: "Financial Modelling and Valuation", major: "Finance", color: "#99FF99" },
    { name: "Security Analysis & Portfolio Management", major: "Finance", color: "#99FF99" },
    { name: "Consumer Behaviour", major: "Marketing", color: "#FF9999" },
    { name: "Product & Brand Management", major: "Marketing", color: "#FF9999" },
    { name: "Project Management", major: "Operations", color: "#FFFF99" }
  ],
  5: [
    { name: "Machine Learning II", major: "Analytics", color: "#FFCC99" },
    { name: "Marketing & Retail Analytics", major: "Analytics, Marketing", color: "#FF9999", crossListed: true },
    { name: "Fintech", major: "Digital Strategy, Finance", color: "#99FF99", crossListed: true },
    { name: "Advanced Digital Marketing", major: "Digital Strategy, Marketing", color: "#FF9999", crossListed: true },
    { name: "Design Thinking", major: "Digital Strategy, Open Electives", color: "#9999FF", crossListed: true },
    { name: "B2B Marketing", major: "Marketing", color: "#FF9999" },
    { name: "Emotional Intelligence for Leadership", major: "Open Electives", color: "#CCCCCC" },
    { name: "Strategic Sourcing and Procurement", major: "Operations", color: "#FFFF99" },
    { name: "Supply Chain Modeling and Analysis", major: "Operations", color: "#FFFF99" }
  ],
  6: [
    { name: "Deep Learning & AI", major: "Analytics", color: "#FFCC99" },
    { name: "Big Data & Cloud Analytics", major: "Analytics, Digital Strategy", color: "#FFCC99", crossListed: true },
    { name: "Financial Risk Analytics", major: "Analytics, Finance", color: "#99FF99", crossListed: true },
    { name: "Spatial Computing in Marketing", major: "Digital Strategy, Marketing", color: "#FF9999", crossListed: true },
    { name: "Technology Product Management", major: "Digital Strategy, Open Electives", color: "#9999FF", crossListed: true },
    { name: "Financial Inclusion and Microfinance", major: "Finance", color: "#99FF99" },
    { name: "Customer Relationship Management", major: "Marketing", color: "#FF9999" },
    { name: "Negotiation and Bargaining", major: "Open Electives", color: "#CCCCCC" },
    { name: "Demand Planning & Forecasting", major: "Operations", color: "#FFFF99" },
    { name: "Service Operations Management", major: "Operations", color: "#FFFF99" }
  ],
  7: [
    { name: "Natural Language Processing", major: "Analytics", color: "#FFCC99" },
    { name: "HR Analytics", major: "Analytics, Open Electives", color: "#FFCC99", crossListed: true },
    { name: "Alternative Investments (0.5 credit)", major: "Finance", color: "#99FF99" },
    { name: "Mergers & Acquisitions", major: "Finance", color: "#99FF99" },
    { name: "Personal and Behavioral Finance", major: "Finance", color: "#99FF99" },
    { name: "Integrating Marketing Communication", major: "Marketing", color: "#FF9999" },
    { name: "Services Marketing", major: "Marketing", color: "#FF9999" },
    { name: "Business Ethics in Practice", major: "Open Electives", color: "#CCCCCC" },
    { name: "Game Theory", major: "Open Electives", color: "#CCCCCC" },
    { name: "Business Excellence for Competitive Advantage", major: "Operations", color: "#FFFF99" }
  ]
};


const termLimits = {
  4: { min: 3, max: 5 },
  5: { min: 3, max: 5 },
  6: { min: 3, max: 4 },
  7: { min: 2, max: 3 }
};

function App() {
  // Initialize analytics as null and handle initialization safely
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const analyticsInstance = getAnalytics(app);
      setAnalytics(analyticsInstance);
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  }, []);

  const [simulationStarted, setSimulationStarted] = useState(false);
  const [selectedElectives, setSelectedElectives] = useState({ 4: [], 5: [], 6: [], 7: [] });
  const [popup, setPopup] = useState({ visible: false, elective: null, term: null });
  const [messagePopup, setMessagePopup] = useState({ visible: false, message: "" });
  
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, "page_view", { page_title: "Elective Simulation", page_location: window.location.href });
    }
  }, [analytics]);


  const handleStartSimulation = () => {
    setSimulationStarted(true);
    logEvent(analytics, "simulation_started", { time: new Date().toISOString() });
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
        // Check prerequisites for Deep Learning & AI and NLP
        if (elective.name === "Deep Learning & AI" || elective.name === "Natural Language Processing") {
          const ml1Selected = Object.values(updatedSelection).flat().some(e => e.name === "Machine Learning I");
          const ml2Selected = Object.values(updatedSelection).flat().some(e => e.name === "Machine Learning II");
          
          if (!ml1Selected || !ml2Selected) {
            showMessagePopup("Prerequisites Required: Machine Learning I and Machine Learning II must be selected before taking this course.");
            return updatedSelection;
          }
        }

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
      case "Analytics":
        return "#FFCC99";
      case "Digital Strategy":
        return "#9999FF";
      case "Finance":
        return "#99FF99";
      case "Marketing":
        return "#FF9999";
      case "Open Electives":
        return "#CCCCCC";
      case "Operations":
        return "#FFFF99";
      default:
        return "#e0e0e0";
    }    
  };

  const determineMajorMinor = () => {
    const counts = {};

    // Count the number of courses in each area
    Object.values(selectedElectives).flat().forEach((elective) => {
      const majors = elective.major.split(",").map(m => m.trim());
      majors.forEach((major) => {
        counts[major] = (counts[major] || 0) + 1;
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
    // Only log analytics if available
    if (analytics) {
      logEvent(analytics, "validate_button_clicked", {
        timestamp: new Date().toISOString(),
        total_selected: Object.values(selectedElectives).flat().length
      });
    }

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

  // Add null checks for popup message rendering
  const renderPopupMessage = () => {
    if (!messagePopup.message) return null;
    
    return Array.isArray(messagePopup.message) ? (
      <ul className="validation-list">
        {messagePopup.message.map((msg, index) => (
          <li key={index} className="validation-item">
            {msg}
          </li>
        ))}
      </ul>
    ) : (
      <p>{messagePopup.message}</p>
    );
  };

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
      <header className="app-header sticky">
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
                  const majors = elective.major.split(",").map(m => m.trim());
                  
                  return (
                    <div
                      key={elective.name}
                      className={`elective-tile ${isSelected ? "selected" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleSelectElective(parseInt(term), elective)}
                    >
                      <span className="elective-name">{elective.name}</span>
                      <div className="major-tags">
                        {majors.map(major => (
                          <span 
                            key={major} 
                            className="major-tag"
                            style={{ backgroundColor: getColorForCategory(major) }}
                          >
                            {major}
                          </span>
                        ))}
                      </div>
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
                { name: "Analytics", color: "#FFCC99" },
                { name: "Digital Strategy", color: "#9999FF" },
                { name: "Finance", color: "#99FF99" },
                { name: "Marketing", color: "#FF9999" },
                { name: "Open Electives", color: "#CCCCCC" },
                { name: "Operations", color: "#FFFF99" }
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
          <div className={`popup-content ${messagePopup.type || ''}`}>
            <h3 className={`popup-title ${messagePopup.type || ''}`}>
              {messagePopup.title || 'Message'}
            </h3>
            <div className="popup-message-container">
              {renderPopupMessage()}
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