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
    { name: "Financial Risk Analytics", major: "Finance, Analytics", color: "#99FF99", crossListed: true }
  ],
  7: [
    { name: "Services Marketing", major: "Marketing", color: "#FF9999" },
    { name: "Mergers & Acquisitions", major: "Finance", color: "#99FF99" },
    { name: "Business Excellence for Competitive Advantage", major: "Operations", color: "#FFFF99" },
    { name: "Natural Language Processing", major: "Analytics", color: "#FFCC99" },
    { name: "Game Theory", major: "Open Electives", color: "#CCCCCC" },
    { name: "HR Analytics", major: "Analytics, Open Electives", color: "#FFCC99", crossListed: true },
    { name: "Personal and Behavioral Finance", major: "Finance", color: "#99FF99" },
    { name: "Alternative Investments (0.5 credit)", major: "Finance", color: "#99FF99" }
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
    // Check total number of selected electives
    const totalSelected = Object.values(selectedElectives).flat().length;
    if (totalSelected !== 14) {
      showMessagePopup(`You have selected ${totalSelected} electives. Please select exactly 14 electives.`);
      return;
    }

    // Check term limits
    for (const term in termLimits) {
      const selectedCount = selectedElectives[term].length;
      if (selectedCount < termLimits[term].min || selectedCount > termLimits[term].max) {
        showMessagePopup(`Term ${term} must have between ${termLimits[term].min} and ${termLimits[term].max} electives.`);
        return;
      }
    }

    // Check major/minor/general management criteria
    const outcome = determineMajorMinor();
    if (outcome.includes("No major or minor yet")) {
      showMessagePopup("Your selection does not meet the criteria for a major, minor, or general management.");
      return;
    }

    showMessagePopup("Your selection is valid!");
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
      {/* Left Panel - Term-Wise Selection */}
      <div className="term-selection">
        {Object.keys(electivesData).map((term) => (
          <div key={term} className="term-card">
            <h3>Term {term}</h3>
            <div className="electives-grid">
              {electivesData[term].map((elective) => {
                const isSelected = selectedElectives[term].find((e) => e.name === elective.name);
                const color = isSelected ? isSelected.color : "#e0e0e0";
                return (
                  <div
                    key={elective.name}
                    className={`elective-card ${isSelected ? "selected" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleSelectElective(parseInt(term), elective)}
                  >
                    {elective.name}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Right Panel - Rules and Summary */}
      <div className="rules-summary">
        <h2>Rules and Information</h2>
        <p>- Each term has a minimum and maximum number of electives.</p>
        <p>- Cross-listed courses can only be counted once, and you can choose their category.</p>
        <p>- Color-coded subjects indicate their major:</p>
        <ul>
          <li style={{ color: "#99FF99" }}>Finance</li>
          <li style={{ color: "#9999FF" }}>Digital Strategy</li>
          <li style={{ color: "#FF9999" }}>Marketing</li>
          <li style={{ color: "#FFFF99" }}>Operations</li>
          <li style={{ color: "#FFCC99" }}>Analytics</li>
          <li style={{ color: "#CCCCCC" }}>Open Electives</li>
        </ul>

        {/* Counter for Selected Electives */}
        <div className="selected-electives-counter">
          <h3>Selected Electives</h3>
          <p>
            <strong>{totalSelectedElectives}</strong> out of <strong>14</strong> selected
          </p>
        </div>

        <h2>Selected Summary</h2>
        {Object.keys(selectedElectives).map((term) => (
          <div key={term}>
            <h3>Term {term}</h3>
            <ul>
              {selectedElectives[term].map((elective, idx) => (
                <li key={idx} style={{ color: elective.color }}>
                  {elective.name}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h2>Outcome</h2>
        <p>{determineMajorMinor()}</p>

        {/* Check Button */}
        <button className="check-button" onClick={handleCheck}>
          Check Validity
        </button>

        {/* Reset Button */}
        <button className="reset-button" onClick={handleResetSimulation}>
          Reset Simulation
        </button>
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
          <div className="popup-content">
            <h3>Message</h3>
            <p>{messagePopup.message}</p>
            <button
              className="cancel-button"
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