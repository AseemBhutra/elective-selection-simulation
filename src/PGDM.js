import React, { useState } from "react";
import "./App.css";
import { useFirebaseAnalytics } from './hooks/useFirebaseAnalytics';

// Updated major categories
const majorCategories = [
  { name: "Marketing", color: "#FF9999" },
  { name: "Finance", color: "#99FF99" },
  { name: "Operations", color: "#FFFF99" },
  { name: "HR", color: "#FF99FF" },
  { name: "Analytics", color: "#FFCC99" },
  { name: "Open Elective", color: "#A9A9A9" }
];

// Updated term requirements
const termRequirements = {
  4: { required: 5 },
  5: { required: 3 },
  6: { required: 3 }
};

// Updated electives data
const electivesData = {
  4: [
    { name: "Business Intelligence", major: "Analytics", color: "#FFCC99", credits: 3 },
    { name: "Fintech", major: "Analytics, Finance", color: "#99FF99", crossListed: true, credits: 3 },
    { name: "Machine Learning", major: "Analytics", color: "#FFCC99", credits: 3 },
    { name: "Marketing & Retail Analytics", major: "Analytics, Marketing", color: "#FFCC99", crossListed: true, credits: 3 },
    { name: "Financial Statement Analysis & Valuation", major: "Finance", color: "#99FF99", credits: 3 },
    { name: "Security Analysis & Portfolio Management", major: "Finance", color: "#99FF99", credits: 3 },
    { name: "Wealth Management", major: "Finance", color: "#99FF99", credits: 3 },
    { name: "Strategic Negotiation", major: "HR, Open Elective", color: "#FF99FF", crossListed: true, credits: 3 },
    { name: "Talent Acquisition through Employee Value Proposition", major: "HR", color: "#FF99FF", credits: 3 },
    { name: "Total Rewards for Retaining Talents", major: "HR", color: "#FF99FF", credits: 3 },
    { name: "Consumer Behaviour", major: "Marketing", color: "#FF9999", credits: 3 },
    { name: "Digital Marketing", major: "Marketing", color: "#FF9999", credits: 3 },
    { name: "Sales & Distribution Management", major: "Marketing", color: "#FF9999", credits: 3 },
    { name: "Enterprise Resources Planning", major: "Operations", color: "#FFFF99", credits: 3 },
    { name: "Project Management", major: "Operations", color: "#FFFF99", credits: 3 },
    { name: "Strategic Sourcing and Procurement", major: "Operations", color: "#FFFF99", credits: 3 }
  ],
  5: [
    { name: "Deep Learning & Natural Language Processing", major: "Analytics", color: "#FFCC99", credits: 3 },
    { name: "Web and Social Media Analytics", major: "Analytics, Marketing", color: "#FFCC99", crossListed: true, credits: 3 },
    { name: "Derivatives & Financial Risk Management", major: "Finance", color: "#99FF99", credits: 3 },
    { name: "Financial Management for Developing Marketing Strategy", major: "Finance", color: "#99FF99", credits: 3 },
    { name: "Mergers & Acquisitions", major: "Finance", color: "#99FF99", credits: 3 },
    { name: "Creating High Performance and Agile Organization", major: "HR", color: "#FF99FF", credits: 3 },
    { name: "Emotionally Intelligent Leadership", major: "HR, Open Elective", color: "#FF99FF", crossListed: true, credits: 3 },
    { name: "B2B Marketing", major: "Marketing", color: "#FF9999", credits: 3 },
    { name: "Product & Brand Management", major: "Marketing", color: "#FF9999", credits: 3 },
    { name: "Business Excellence for Competitive Advantage", major: "Operations", color: "#FFFF99", credits: 3 },
    { name: "Supply Chain Management", major: "Operations", color: "#FFFF99", credits: 3 }
  ],
  6: [
    { name: "Big Data & Cloud Analytics for Managers", major: "Analytics", color: "#FFCC99", credits: 3 },
    { name: "Financial Risk Analytics", major: "Analytics", color: "#FFCC99", credits: 3 },
    { name: "HR Analytics", major: "Analytics, HR", color: "#FF99FF", crossListed: true, credits: 3 },
    { name: "Banking Management", major: "Finance", color: "#99FF99", credits: 3 },
    { name: "Behavioural Economics and Finance", major: "Finance", color: "#99FF99", credits: 3 },
    { name: "Project Finance", major: "Finance", color: "#99FF99", credits: 3 },
    { name: "Managing Business in an International Context", major: "HR, Open Elective", color: "#FF99FF", crossListed: true, credits: 3 },
    { name: "CRM", major: "Marketing", color: "#FF9999", credits: 3 },
    { name: "Integrated Marketing Communication", major: "Marketing", color: "#FF9999", credits: 3 },
    { name: "Services Marketing", major: "Marketing", color: "#FF9999", credits: 3 },
    { name: "Game Theory and Public Policy", major: "Open Elective", color: "#A9A9A9", credits: 3 },
    { name: "Demand Planning & Forecasting", major: "Operations, Analytics", color: "#FFFF99", crossListed: true, credits: 3 },
    { name: "Internet Business", major: "Operations", color: "#FFFF99", credits: 3 },
    { name: "Service Operations", major: "Operations", color: "#FFFF99", credits: 3 }
  ]
};




const prerequisites = {
  "Deep Learning & Natural Language Processing": ["Machine Learning"]
};

const dependentCourses = {
  "Machine Learning": ["Deep Learning & Natural Language Processing"]
};



function PGDM() {
  const logAnalyticsEvent = useFirebaseAnalytics();
  const [selectedElectives, setSelectedElectives] = useState({ 4: [], 5: [], 6: [] });
  const [popup, setPopup] = useState({ visible: false, elective: null, term: null });
  const [messagePopup, setMessagePopup] = useState({ visible: false, message: "" });
  const [showSubjects, setShowSubjects] = useState(false);

  const handleResetSimulation = () => {
    logAnalyticsEvent('pgdm_reset_simulation', {
      total_selected: Object.values(selectedElectives).flat().length
    });
    setSelectedElectives({ 4: [], 5: [], 6: [] });
  };

  const showMessagePopup = (message) => {
    setMessagePopup({ visible: true, message });
  };

  const determineMajorMinor = () => {
    const counts = {};
    Object.values(selectedElectives).flat().forEach((elective) => {
      const majors = elective.major.split(",").map(m => m.trim());
      majors.forEach((major) => {
        counts[major] = (counts[major] || 0) + 1;
      });
    });

    const functionalAreas = ["Marketing", "Finance", "Operations", "Analytics", "HR"];
    const isGeneralManagement = functionalAreas.every((area) => (counts[area] || 0) >= 2);
    const majorAreas = Object.entries(counts)
      .filter(([area, count]) => count >= 6 && functionalAreas.includes(area))
      .map(([area]) => area);
    const minorAreas = Object.entries(counts)
      .filter(([area, count]) => count >= 3 && count < 6 && functionalAreas.includes(area))
      .map(([area]) => area);

    if (isGeneralManagement) {
      return "General Management (2 or more courses in each functional area)";
    } else if (majorAreas.length >= 1 && minorAreas.length >= 1) {
      return `Major: ${majorAreas[0]}, Minor: ${minorAreas[0]}`;
    } else if (majorAreas.length >= 1) {
      return `Major: ${majorAreas[0]}`;
    } else if (minorAreas.length >= 1) {
      return `Minor: ${minorAreas[0]} (Need more courses for a major)`;
    }
    return "No major or minor yet. Keep selecting courses.";
  };

  const handleDownloadSelection = () => {
    const lines = [];
  
    lines.push("PGDM Elective Selection Report");
    lines.push(determineMajorMinor());
    lines.push("");
  
    Object.entries(selectedElectives).forEach(([term, electives]) => {
      lines.push(`Term ${term}:`);
      electives.forEach(e => {
        lines.push(`${e.name} (${e.major})`);
      });
      lines.push(""); // Empty line between terms
    });
  
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PGDM_Valid_Electives.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  const handleCheck = () => {
    logAnalyticsEvent('pgdm_validate_selection', {
      total_selected: Object.values(selectedElectives).flat().length,
      outcome: determineMajorMinor()
    });

    let validationErrors = [];
    const totalSelected = Object.values(selectedElectives).flat().length;
    
    if (totalSelected !== 11) {
      validationErrors.push(`You need to select exactly 11 electives (currently selected: ${totalSelected})`);
    }

    Object.entries(termRequirements).forEach(([term, { required }]) => {
      const selectedCount = selectedElectives[term].length;
      if (selectedCount !== required) {
        validationErrors.push(
          `Term ${term}: You must select exactly ${required} electives (currently selected: ${selectedCount})`
        );
      }
    });

    const areaCounts = {};
    Object.values(selectedElectives).flat().forEach((elective) => {
      const majors = elective.major.split(",").map(m => m.trim());
      majors.forEach((major) => {
        areaCounts[major] = (areaCounts[major] || 0) + 1;
      });
    });

    const functionalAreas = ["Marketing", "Finance", "Operations", "Analytics", "HR"];
    const hasValidSpecialization = 
      Object.entries(areaCounts).some(([area, count]) => count >= 6 && functionalAreas.includes(area)) ||
      functionalAreas.every(area => (areaCounts[area] || 0) >= 2);

    if (!hasValidSpecialization) {
      validationErrors.push(
        "You must either have 6 courses in one area for a major, or at least 2 courses in each of the five functional areas (Marketing, Finance, Operations, Analytics, HR) for General Management"
      );
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
        message: [`${determineMajorMinor()}`]
      });
      setShowSubjects(false); // reset state on each validate
    }
  };

  const handleSelectElective = (term, elective) => {
    logAnalyticsEvent('pgdm_select_elective', {
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

  const toggleElectiveSelection = (term, elective) => {
    setSelectedElectives((prev) => {
      const updatedSelection = { ...prev };
      const termRequirement = termRequirements[term].required;
      const allSelectedCourses = Object.values(prev).flat();

      if (updatedSelection[term].some(e => e.name === elective.name)) {
        const dependentsList = dependentCourses[elective.name] || [];
        const hasSelectedDependents = allSelectedCourses.some(
          course => dependentsList.includes(course.name)
        );

        if (hasSelectedDependents) {
          showMessagePopup(
            `Cannot remove ${elective.name} as it is a prerequisite for other selected courses. Please remove the dependent courses first: ${dependentsList.join(", ")}`
          );
          return updatedSelection;
        }

        updatedSelection[term] = updatedSelection[term].filter(
          (item) => item.name !== elective.name
        );
      } else {
        if (prerequisites[elective.name]) {
          const requiredCourses = prerequisites[elective.name];
          const allSelectedCourseNames = allSelectedCourses.map(e => e.name);
          const missingPrerequisites = requiredCourses.filter(
            course => !allSelectedCourseNames.includes(course)
          );

          if (missingPrerequisites.length > 0) {
            showMessagePopup(
              `You need to select ${missingPrerequisites.join(", ")} before selecting ${elective.name}`
            );
            return updatedSelection;
          }
        }

        if (updatedSelection[term].length >= termRequirement) {
          showMessagePopup(
            `Term ${term} requires exactly ${termRequirement} electives. Please remove one before adding another.`
          );
          return updatedSelection;
        }

        updatedSelection[term] = [...updatedSelection[term], elective];
      }

      return updatedSelection;
    });
  };

  const handlePopupSelection = (category) => {
    const { elective, term } = popup;
    logAnalyticsEvent('pgdm_cross_listed_selection', {
      elective_name: elective.name,
      selected_category: category,
      term
    });

    const updatedElective = { ...elective, major: category, color: getColorForCategory(category) };
    toggleElectiveSelection(term, updatedElective);
    setPopup({ visible: false, elective: null, term: null });
  };

  const getColorForCategory = (category) => {
    switch (category) {
      case "Analytics": return "#FFCC99";
      case "Finance": return "#99FF99";
      case "Marketing": return "#FF9999";
      case "Operations": return "#FFFF99";
      case "HR": return "#FF99FF";
      case "Open Elective": return "#A9A9A9";
      default: return "#e0e0e0";
    }    
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-container") {
      setPopup({ visible: false, elective: null, term: null });
      setMessagePopup({ visible: false, message: "" });
    }
  };

  const totalSelectedElectives = Object.values(selectedElectives).flat().length;

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
                <div key={term}>
                  <p>Term {term}:</p>
                  <ul>
                    {electives.map((e) => (
                      <li key={e.name}>
                        {e.name} ({e.major})
                      </li>
                    ))}
                  </ul>
                </div>
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
) 
: (
  <div className="popup-button-row">
    <button
      className="close-button"
      onClick={() => setMessagePopup({ visible: false, message: "" })}
    >
      Close
    </button>
  </div>
)
}

      </>
    );
  };

  return (
    <div className="app-container">
      <header className="app-header sticky">
        <h1>PGDM Elective Selection Simulation</h1>
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
        <div className="terms-container">
          {Object.keys(electivesData).map((term) => (
            <div key={term} className="term-section">
              <div className="term-header">
                <h2>Term {term}</h2>
                <span className="term-count">
                  {selectedElectives[term].length} / {termRequirements[term].required} required
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
                      <span className="elective-name">{`${elective.name} (${elective.credits})`}</span>
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

        <div className="dashboard">
          <div className="progress-section">
            <h2>Selection Progress</h2>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(totalSelectedElectives / 11) * 100}%` }}
              />
            </div>
            <div className="progress-stats">
              <div>
                <span className="progress-text">
                  {totalSelectedElectives} of 11
                </span>
                <div className="progress-label">Electives Selected</div>
              </div>
              <div>
                <span className="progress-text">
                  {11 - totalSelectedElectives}
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
              {majorCategories.map(category => (
                <div key={category.name} className="legend-item">
                  <span className="color-dot" style={{ backgroundColor: category.color }}></span>
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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

      {messagePopup.visible && (
        <div
          id="popup-container"
          className="popup-overlay"
          onClick={handleOutsideClick}
        >
          <div className={`popup-content ${messagePopup.type || ''}`}>
            <h2 className={`popup-title ${messagePopup.type || ''}`}>
              {messagePopup.title || 'Message'}
            </h2>
            
            <div className="popup-message-container">
              {renderPopupMessage()}
            </div>
            {/* <button
              className="close-button"
              onClick={() => setMessagePopup({ visible: false, message: "" })}
            >
              Close
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default PGDM;