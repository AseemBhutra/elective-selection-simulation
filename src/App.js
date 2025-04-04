import React, { useState, useEffect, useCallback } from "react";
import "./App.css"; // Import the CSS file for styling
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";


// Firebase configuration object - stores API keys and other credentials
// Uses environment variables with fallback values
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "your-app-id",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "your-measurement-id"
};

// Course data organized by term (4-7) containing:
// - name: Course name
// - major: Department/specialization
// - color: UI color code for visual representation
// - crossListed: Boolean flag for courses that count toward multiple majors
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
    { name: "Design Thinking", major: "Digital Strategy, Open Elective", color: "#9999FF", crossListed: true },
    { name: "B2B Marketing", major: "Marketing", color: "#FF9999" },
    { name: "Emotional Intelligence for Leadership", major: "Open Elective", color: "#A9A9A9" },
    { name: "Strategic Sourcing and Procurement", major: "Operations", color: "#FFFF99" },
    { name: "Supply Chain Modeling and Analysis", major: "Operations", color: "#FFFF99" }
  ],
  6: [
    { name: "Deep Learning & AI", major: "Analytics", color: "#FFCC99" },
    { name: "Big Data & Cloud Analytics", major: "Analytics, Digital Strategy", color: "#FFCC99", crossListed: true },
    { name: "Financial Risk Analytics", major: "Analytics, Finance", color: "#99FF99", crossListed: true },
    { name: "Spatial Computing in Marketing", major: "Digital Strategy, Marketing", color: "#FF9999", crossListed: true },
    { name: "Technology Product Management", major: "Digital Strategy, Open Elective", color: "#9999FF", crossListed: true },
    { name: "Financial Inclusion and Microfinance", major: "Finance", color: "#99FF99" },
    { name: "Customer Relationship Management", major: "Marketing", color: "#FF9999" },
    { name: "Negotiation and Bargaining", major: "Open Elective", color: "#A9A9A9" },
    { name: "Demand Planning & Forecasting", major: "Operations", color: "#FFFF99" },
    { name: "Service Operations Management", major: "Operations", color: "#FFFF99" }
  ],
  7: [
    { name: "Natural Language Processing", major: "Analytics", color: "#FFCC99" },
    { name: "HR Analytics", major: "Analytics, Open Elective", color: "#FFCC99", crossListed: true },
    { name: "Alternative Investments (0.5 credit)", major: "Finance", color: "#99FF99" },
    { name: "Mergers & Acquisitions", major: "Finance", color: "#99FF99" },
    { name: "Personal and Behavioral Finance", major: "Finance", color: "#99FF99" },
    { name: "Integrating Marketing Communication", major: "Marketing", color: "#FF9999" },
    { name: "Services Marketing", major: "Marketing", color: "#FF9999" },
    { name: "Business Ethics in Practice", major: "Open Elective", color: "#A9A9A9" },
    { name: "Game Theory", major: "Open Elective", color: "#A9A9A9" },
    { name: "Business Excellence for Competitive Advantage", major: "Operations", color: "#FFFF99" }
  ]
};


// Defines minimum and maximum number of electives that can be selected per term
const termLimits = {
  4: { min: 3, max: 5 },
  5: { min: 3, max: 5 },
  6: { min: 3, max: 4 },
  7: { min: 2, max: 3 }
};

// Create a custom hook for Firebase Analytics
const useFirebaseAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const analyticsInstance = getAnalytics(app);
      setAnalytics(analyticsInstance);
    } catch (error) {
      console.error("Firebase Analytics initialization error:", error);
    }
  }, []);

  const logAnalyticsEvent = useCallback((eventName, eventParams = {}) => {
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  }, [analytics]);

  return logAnalyticsEvent;
};

function App() {
  const logAnalyticsEvent = useFirebaseAnalytics();

  // Core application state
  const [selectedElectives, setSelectedElectives] = useState({ 4: [], 5: [], 6: [], 7: [] });
  const [popup, setPopup] = useState({ visible: false, elective: null, term: null });
  const [messagePopup, setMessagePopup] = useState({ visible: false, message: "" });
  const [showSubjects, setShowSubjects] = useState(false);

  
  // Log page view event when analytics is initialized
  useEffect(() => {
    logAnalyticsEvent("page_view", {
      page_title: "Elective Simulation",
      page_location: window.location.href
    });
  }, [logAnalyticsEvent]);
  


  // Core interaction handlers
  const handleResetSimulation = () => {
    logAnalyticsEvent('reset_simulation', {
      total_selected: Object.values(selectedElectives).flat().length
    });
    setSelectedElectives({ 4: [], 5: [], 6: [], 7: [] });
  };

  const handleSelectElective = (term, elective) => {
    logAnalyticsEvent('select_elective', {
      term,
      elective_name: elective.name,
      elective_major: elective.major,
      is_cross_listed: elective.crossListed || false
    });

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
    // Main course selection logic including:
    // - Prerequisite validation
    // - Mutual exclusivity checks
    // - Term limit enforcement
    // - Total selection limit checks
    setSelectedElectives((prev) => {
      const updatedSelection = { ...prev };
      const allSelectedElectives = Object.values(updatedSelection).flat();

      // Check if trying to deselect a prerequisite
      if (allSelectedElectives.some(e => e.name === elective.name)) {
        // Check if this is a prerequisite for any selected course
        const isPreReqForML2 = elective.name === "Machine Learning I" && 
          allSelectedElectives.some(e => e.name === "Machine Learning II");
        
        const isPreReqForAdvanced = elective.name === "Machine Learning II" && 
          allSelectedElectives.some(e => ["Deep Learning & AI", "Natural Language Processing"].includes(e.name));
        
        const isPreReqForDigitalMarketing = elective.name === "Digital Marketing" && 
          allSelectedElectives.some(e => e.name === "Advanced Digital Marketing");

        if (isPreReqForML2 || isPreReqForAdvanced || isPreReqForDigitalMarketing) {
          showMessagePopup("Cannot remove this course as it is a prerequisite for other selected courses. Please remove the dependent courses first.");
          return updatedSelection;
        }
      }

      // Rest of the existing selection logic
      if (allSelectedElectives.some(e => e.name === elective.name)) {
        // Deselect the elective from the specific term
        updatedSelection[term] = updatedSelection[term].filter(
          (item) => item.name !== elective.name
        );
      } else {
        // Get all selected electives across all terms
        const allSelectedElectives = Object.values(updatedSelection).flat();

        // Check prerequisites for Deep Learning & AI and NLP
        if (elective.name === "Deep Learning & AI" || elective.name === "Natural Language Processing") {
          const ml1Selected = allSelectedElectives.some(e => e.name === "Machine Learning I");
          const ml2Selected = allSelectedElectives.some(e => e.name === "Machine Learning II");
          
          if (!ml1Selected || !ml2Selected) {
            showMessagePopup("Prerequisites Required: Machine Learning I and Machine Learning II must be selected before taking this course.");
            return updatedSelection;
          }
        }

        // Check prerequisite for Machine Learning II
        if (elective.name === "Machine Learning II") {
          const ml1Selected = allSelectedElectives.some(e => e.name === "Machine Learning I");
          
          if (!ml1Selected) {
            showMessagePopup("Prerequisite Required: Machine Learning I must be selected before taking Machine Learning II.");
            return updatedSelection;
          }
        }

        // Check prerequisite for Advanced Digital Marketing
        if (elective.name === "Advanced Digital Marketing") {
          const digitalMarketingSelected = allSelectedElectives.some(e => e.name === "Digital Marketing");
          
          if (!digitalMarketingSelected) {
            showMessagePopup("Prerequisite Required: Digital Marketing must be selected before taking Advanced Digital Marketing.");
            return updatedSelection;
          }
        }

        // Check mutual exclusivity between Service Operations Management and Services Marketing
        if (elective.name === "Service Operations Management") {
          const servicesMarketingSelected = allSelectedElectives.some(e => e.name === "Services Marketing");
          if (servicesMarketingSelected) {
            showMessagePopup("You cannot select Service Operations Management if Services Marketing is already selected. These courses are mutually exclusive.");
            return updatedSelection;
          }
        }

        if (elective.name === "Services Marketing") {
          const serviceOperationsSelected = allSelectedElectives.some(e => e.name === "Service Operations Management");
          if (serviceOperationsSelected) {
            showMessagePopup("You cannot select Services Marketing if Service Operations Management is already selected. These courses are mutually exclusive.");
            return updatedSelection;
          }
        }

        // Check term limits
        if (updatedSelection[term].length >= termLimits[term].max) {
          showMessagePopup(`You can select a maximum of ${termLimits[term].max} electives for Term ${term}.`);
          return updatedSelection;
        }

        // Check total selection limit (14 electives)
        const totalSelected = allSelectedElectives.length;
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
    logAnalyticsEvent('cross_listed_selection', {
      elective_name: elective.name,
      selected_category: category,
      term
    });

    const updatedElective = { 
      ...elective, 
      major: category,
      color: getColorForCategory(category)
    };
    toggleElectiveSelection(term, updatedElective);
    setPopup({ visible: false, elective: null, term: null });
  };

  const getColorForCategory = (category) => {
    // Returns color code for each major category
    switch (category) {
      case "Analytics":
        return "#FFCC99";
      case "Digital Strategy":
        return "#9999FF";
      case "Finance":
        return "#99FF99";
      case "Marketing":
        return "#FF9999";
      case "Open Elective":
        return "#A9A9A9";
      case "Operations":
        return "#FFFF99";
      default:
        return "#e0e0e0";
    }    
  };

  const determineMajorMinor = () => {
    // Analyzes selected courses to determine:
    // - Major(s)
    // - Minor(s)
    // - General Management qualification
    const counts = {};

    // Count the number of courses in each area
    Object.values(selectedElectives).flat().forEach((elective) => {
      const majors = elective.major.split(",").map(m => m.trim());
      majors.forEach((major) => {
        // Ignore Open Electives when calculating majors/minors
        if (major !== "Open Elective") {
            counts[major] = (counts[major] || 0) + 1;
        }
      });
    });

    // Define thresholds
    const MAJOR_THRESHOLD = 6; // At least 6 courses for a major
    const MINOR_THRESHOLD = 4; // At least 4 courses for a minor
    const GENERAL_MANAGEMENT_THRESHOLD = 2; // At least 2 courses in each area for general management

    // List of functional areas
    const functionalAreas = ["Marketing", "Finance", "Operations", "Analytics", "Digital Strategy", "Open Elective"];

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
    logAnalyticsEvent('validate_selection', {
      total_selected: Object.values(selectedElectives).flat().length,
      outcome: determineMajorMinor()
    });

    let validationErrors = [];

    // Check total number of selected electives
    const totalSelected = Object.values(selectedElectives).flat().length;
    if (totalSelected !== 14) {
      validationErrors.push(`Missing ${14 - totalSelected} electives`);
    }

    // Check for at least one open elective
    const hasOpenElective = Object.values(selectedElectives)
      .flat()
      .some(elective => elective.major.includes("Open Elective"));
    
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
      // Format selected electives by term

      setMessagePopup({
        visible: true,
        type: 'success',
        title: 'Valid Selection',
        message: [`${determineMajorMinor()}`]
      });
      setShowSubjects(false);
    }
  };      

  const totalSelectedElectives = Object.values(selectedElectives).flat().length;

  const handleDownloadSelection = () => {
    const lines = [];
  
    lines.push("PGPM Elective Selection Report");
    lines.push(determineMajorMinor());
    lines.push("");
  
    Object.entries(selectedElectives).forEach(([term, electives]) => {
      if (electives.length > 0) {
        lines.push(`Term ${term}:`);
        electives.forEach(e => {
          lines.push(`${e.name} (${e.major})`);
        });
        lines.push(""); // Add an empty line after each term
      }
    });
  
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PGPM_Valid_Electives.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const [showButton, setShowButton] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setShowButton(window.scrollY > 300);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};


  // UI rendering helpers
  const renderPopupMessage = () => {
    if (!messagePopup.message) return null;
  
    const isSuccess = messagePopup.type === 'success';
  
    return (
      <>
        <div className="popup-message-container">
          {Array.isArray(messagePopup.message) ? (
            <ul className="validation-list">
              {messagePopup.message.map((msg, index) => (
                <li key={index} className="validation-item">{msg}</li>
              ))}
            </ul>
          ) : (
            <p>{messagePopup.message}</p>
          )}
  
          {isSuccess && showSubjects && (
            <div className="selected-subjects">
              <strong>Selected Subjects:</strong>
              {Object.entries(selectedElectives).map(([term, electives]) => (
                electives.length > 0 && (
                  <div key={term}>
                    <p><strong>Term {term}:</strong></p>
                    <ul>
                      {electives.map((e) => (
                        <li key={e.name}>
                          {e.name} ({e.major})
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
  
        {isSuccess ? (
          <div className="popup-button-row">
            
            <button
              className="secondary-button"
              onClick={() => setShowSubjects(!showSubjects)}
            >
              {showSubjects ? "Hide Subjects" : "Show Subjects"}
            </button>
            <button
      className="secondary-button"
      onClick={handleDownloadSelection}
    >
      Download
    </button>
            {/* <button
              className="close-button"
              onClick={() => setMessagePopup({ visible: false, message: "" })}
            >
              Close
            </button> */}
          </div>
        ) : (
          <div className="popup-button-row">
            <button
              className="close-button"
              onClick={() => setMessagePopup({ visible: false, message: "" })}
            >
              Close
            </button>
          </div>
        )}
      </>
    );
  };
  
  
  

  // Main render logic
  return (
    // Main application UI including:
    // - Header with controls
    // - Term-wise course selection grid
    // - Progress dashboard
    // - Popups for cross-listed courses and messages
    <div className="app-container">
      <header className="app-header sticky">
        <h1>PGPM Elective Selection Simulator</h1>
        <div className="header-controls">
          <button className="primary-button" onClick={handleCheck}>
            Validate
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
                { name: "Open Elective", color: "#A9A9A9" },
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

{showButton && (
  <button
    onClick={scrollToTop}
    className="scroll-to-top"
    aria-label="Scroll to top"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up h-6 w-6">
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  </button>
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

      {/* ✅ This renders the button and subject list */}
      {renderPopupMessage()}
    </div>
  </div>
)}


    </div>
  );
}

export default App;