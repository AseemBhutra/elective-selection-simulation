import React, { useState, useEffect } from "react";
import "./App.css";
import { useFirebaseAnalytics } from './hooks/useFirebaseAnalytics';

// Major categories with their associated colors
const majorCategories = [
  { name: "Marketing", color: "#FF9999" },
  { name: "Finance", color: "#99FF99" },
  { name: "Operations", color: "#FFFF99" },
  { name: "HR", color: "#FF99FF" },
  { name: "Analytics", color: "#FFCC99" },
  { name: "Open Elective", color: "#A9A9A9" }
];

// Term requirements mapping - number of electives required per term
const termRequirements = {
  4: { required: 5 },
  5: { required: 3 },
  6: { required: 3 }
};

// Electives data organized by term
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

// Course prerequisites mapping
const prerequisites = {
  "Deep Learning & Natural Language Processing": ["Machine Learning"]
};

// Courses that depend on others (inverse of prerequisites)
const dependentCourses = {
  "Machine Learning": ["Deep Learning & Natural Language Processing"]
};

function PGDM() {
  const logAnalyticsEvent = useFirebaseAnalytics();
  const [selectedElectives, setSelectedElectives] = useState({ 4: [], 5: [], 6: [] });
  const [popup, setPopup] = useState({ visible: false, elective: null, term: null });
  const [messagePopup, setMessagePopup] = useState({ visible: false, message: "", type: "", title: "" });
  const [showSubjects, setShowSubjects] = useState(false);
  const [showButton, setShowButton] = useState(false);

  /**
   * Set up scroll listener for "back to top" button
   */
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Resets the simulation by clearing all selections
   */
  const handleResetSimulation = () => {
    logAnalyticsEvent('pgdm_reset_simulation', {
      total_selected: Object.values(selectedElectives).flat().length
    });
    setSelectedElectives({ 4: [], 5: [], 6: [] });
  };

  /**
   * Shows message popup with provided details
   * @param {string|string[]} message - Message or array of messages to display
   * @param {string} type - Type of message (success, error, info)
   * @param {string} title - Title for the popup
   */
  const showMessagePopup = (message, type = "info", title = "Message") => {
    setMessagePopup({ visible: true, message, type, title });
  };

  /**
   * Analyzes selected courses to determine specialization (Major/Minor)
   * @returns {Object} Specialization details with text and JSX representation
   */
  const determineMajorMinor = () => {
    // Count electives by major area
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
      return {
        text: "Specialization: General Management (Minimum two electives in each functional area)",
        jsx: (
          <>
            <strong>Specialization:</strong> General Management <br />
            <small>(Minimum two electives in each functional area)</small>
          </>
        )
      };
    } else if (majorAreas.length >= 1 && minorAreas.length >= 1) {
      return {
        text: `Specialization: Major in ${majorAreas[0]}, Minor in ${minorAreas[0]}`,
        jsx: (
          <span>
            <strong>Specialization:</strong> Major in <strong>{majorAreas[0]}</strong>, Minor in <strong>{minorAreas[0]}</strong>
          </span>
        )
      };
    } else if (majorAreas.length >= 1) {
      return {
        text: `Specialization: Major in ${majorAreas[0]}`,
        jsx: (
          <span>
            <strong>Specialization:</strong> Major in <strong>{majorAreas[0]}</strong>
          </span>
        )
      };
    } else if (minorAreas.length >= 1) {
      return {
        text: `Specialization: Minor in ${minorAreas[0]} (Add more electives to qualify for a Major)`,
        jsx: (
          <span>
            <strong>Specialization:</strong> Minor in <strong>{minorAreas[0]}</strong> <br />
            <small>(Add more electives to qualify for a Major)</small>
          </span>
        )
      };
    }
  
    return {
      text: "Specialization: Not determined yet (Please select more electives to qualify for a Major or Minor)",
      jsx: (
        <span>
          <strong>Specialization:</strong> Not determined yet <br />
          <small>Please select more electives to qualify for a Major or Minor.</small>
        </span>
      )
    };
  };
  
  /**
   * Creates and downloads a text file with the selection report
   */
  const handleDownloadSelection = () => {
    logAnalyticsEvent('pgdm_download_selection', {
      total_selected: Object.values(selectedElectives).flat().length,
      specialization: determineMajorMinor().text
    });

    const lines = [];
  
    lines.push("PGDM Elective Selection Report");
    lines.push(determineMajorMinor().text);
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
    window.URL.revokeObjectURL(url); // Clean up
  };
  
  /**
   * Validates the current elective selection
   * Checks total count, per-term requirements, and specialization validity
   */
  const handleCheck = () => {
    const specialization = determineMajorMinor();
    logAnalyticsEvent('pgdm_validate_selection', {
      total_selected: Object.values(selectedElectives).flat().length,
      outcome: specialization.text
    });
  
    let validationErrors = [];
    const totalSelected = Object.values(selectedElectives).flat().length;
  
    // Total electives validation
    if (totalSelected !== 11) {
      validationErrors.push(`A total of 11 electives are required. You have currently selected ${totalSelected}.`);
    }
  
    // Term-wise requirements
    Object.entries(termRequirements).forEach(([term, { required }]) => {
      const selectedCount = selectedElectives[term].length;
      if (selectedCount !== required) {
        validationErrors.push(
          `Term ${term}: ${required} electives required. You have selected ${selectedCount}.`
        );
      }
    });
  
    // Specialization validation
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
        "To qualify for a specialization, please ensure:\n" +
        "• A minimum of 6 electives in one area (e.g., Marketing, Finance) for a Major, or\n" +
        "• At least 2 electives in each functional area for General Management."
      );
    }
  
    if (validationErrors.length > 0) {
      showMessagePopup(validationErrors, 'error', 'Please Review Your Selection:');
    } else {
      showMessagePopup([specialization.text], 'success', 'Valid Selection');
      setShowSubjects(false); // reset state on each validate
    }
  };

  /**
   * Checks if an elective can be removed based on dependencies
   * @param {Object} elective - The elective to check
   * @param {Array} allSelectedCourses - All currently selected courses
   * @returns {Object} Result with status and message
   */
  const canRemoveElective = (elective, allSelectedCourses) => {
    const dependentsList = dependentCourses[elective.name] || [];
    const hasSelectedDependents = allSelectedCourses.some(
      course => dependentsList.includes(course.name)
    );

    if (hasSelectedDependents) {
      return {
        canRemove: false,
        message: `Cannot remove ${elective.name} as it is a prerequisite for other selected courses. Please remove the dependent courses first: ${dependentsList.join(", ")}`
      };
    }

    return { canRemove: true };
  };

  /**
   * Checks if prerequisites are satisfied for an elective
   * @param {Object} elective - The elective to check
   * @param {Array} allSelectedCourses - All currently selected courses
   * @returns {Object} Result with status and message
   */
  const arePrerequisitesSatisfied = (elective, allSelectedCourses) => {
    if (!prerequisites[elective.name]) {
      return { satisfied: true };
    }

    const requiredCourses = prerequisites[elective.name];
    const allSelectedCourseNames = allSelectedCourses.map(e => e.name);
    const missingPrerequisites = requiredCourses.filter(
      course => !allSelectedCourseNames.includes(course)
    );

    if (missingPrerequisites.length > 0) {
      return {
        satisfied: false,
        message: `You need to select ${missingPrerequisites.join(", ")} before selecting ${elective.name}`
      };
    }

    return { satisfied: true };
  };

  /**
   * Checks if term limit is reached
   * @param {number} term - The term to check
   * @param {Array} termElectives - Currently selected electives for the term
   * @returns {Object} Result with status and message
   */
  const isTermLimitReached = (term, termElectives) => {
    const termRequirement = termRequirements[term].required;
    if (termElectives.length >= termRequirement) {
      return {
        limitReached: true,
        message: `Term ${term} requires exactly ${termRequirement} electives. Please remove one before adding another.`
      };
    }
    return { limitReached: false };
  };

  /**
   * Initial handler for elective selection/deselection
   * Performs initial checks and opens popup for cross-listed courses
   * @param {number} term - Term number
   * @param {Object} elective - Elective object
   */
  const handleSelectElective = (term, elective) => {
    const isSelected = selectedElectives[term].some(e => e.name === elective.name);
    
    // Log analytics event
    logAnalyticsEvent('pgdm_elective_interaction', {
      action: isSelected ? 'deselect' : 'select',
      term,
      elective_name: elective.name,
      elective_major: elective.major,
      is_cross_listed: elective.crossListed || false
    });

    // If course is already selected, attempt to deselect it
    if (isSelected) {
      handleElectiveDeselection(term, elective);
      return;
    }
    
    // If course is cross-listed and not selected, show the popup
    if (elective.crossListed) {
      setPopup({ visible: true, elective, term });
      return;
    }
    
    // Otherwise proceed with selection
    handleElectiveSelection(term, elective);
  };

  /**
   * Handles the deselection of an elective
   * @param {number} term - Term number
   * @param {Object} elective - Elective object
   */
  const handleElectiveDeselection = (term, elective) => {
    const allSelectedCourses = Object.values(selectedElectives).flat();
    const result = canRemoveElective(elective, allSelectedCourses);
    
    if (!result.canRemove) {
      showMessagePopup(result.message);
      return;
    }
    
    // Remove the elective
    setSelectedElectives(prev => {
      const updatedSelection = { ...prev };
      updatedSelection[term] = updatedSelection[term].filter(
        (item) => item.name !== elective.name
      );
      return updatedSelection;
    });
    
    logAnalyticsEvent('pgdm_elective_deselected', {
      term,
      elective_name: elective.name,
      elective_major: elective.major
    });
  };
  
  /**
   * Handles the selection of an elective
   * @param {number} term - Term number
   * @param {Object} elective - Elective object
   */
  const handleElectiveSelection = (term, elective) => {
    const allSelectedCourses = Object.values(selectedElectives).flat();
    
    // Check prerequisites
    const prerequisiteCheck = arePrerequisitesSatisfied(elective, allSelectedCourses);
    if (!prerequisiteCheck.satisfied) {
      showMessagePopup(prerequisiteCheck.message);
      return;
    }
    
    // Check term limits
    const termLimitCheck = isTermLimitReached(term, selectedElectives[term]);
    if (termLimitCheck.limitReached) {
      showMessagePopup(termLimitCheck.message);
      return;
    }
    
    // Add the elective
    setSelectedElectives(prev => {
      const updatedSelection = { ...prev };
      updatedSelection[term] = [...updatedSelection[term], elective];
      return updatedSelection;
    });
    
    logAnalyticsEvent('pgdm_elective_selected', {
      term,
      elective_name: elective.name,
      elective_major: elective.major
    });
  };

  /**
   * Handles the selection of a category for cross-listed courses
   * @param {string} category - Selected category
   */
  const handlePopupSelection = (category) => {
    const { elective, term } = popup;
    
    logAnalyticsEvent('pgdm_cross_listed_selection', {
      elective_name: elective.name,
      selected_category: category,
      term
    });

    const updatedElective = { 
      ...elective, 
      major: category, 
      color: getColorForCategory(category) 
    };
    
    handleElectiveSelection(term, updatedElective);
    setPopup({ visible: false, elective: null, term: null });
  };

  /**
   * Gets the color code for a specific category
   * @param {string} category - Category name
   * @returns {string} Color code
   */
  const getColorForCategory = (category) => {
    const foundCategory = majorCategories.find(cat => cat.name === category);
    return foundCategory ? foundCategory.color : "#e0e0e0";
  };

  /**
   * Handles clicks outside of popup to close it
   * @param {Event} e - Click event
   */
  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-container") {
      setPopup({ visible: false, elective: null, term: null });
      setMessagePopup({ visible: false, message: "" });
    }
  };

  /**
   * Scrolls to top of the page smoothly
   */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Renders message popup content based on messagePopup state
   * @returns {React.ReactNode}
   */
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
              {showSubjects ? "Hide Subjects" : "View Selected Electives"}
            </button>
            
            <button
              className="secondary-button"
              onClick={handleDownloadSelection}
            >
              Download
            </button>
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

  const totalSelectedElectives = Object.values(selectedElectives).flat().length;

  return (
    <div className="app-container">
      <header className="app-header sticky">
        <h1>PGDM Elective Selection Simulator</h1>
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
            <h2>🎯 Your Specialization Outcome</h2>
            <div className="outcome-card">
              {determineMajorMinor().jsx}
            </div>
          </div>

          <div className="legend-section">
            <h2>🎓 Functional Areas (Color Legend)</h2>
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
            <h3>Choose Specialization for: {popup.elective.name}</h3>
            <p>This course is listed under multiple specializations. Please choose the one you wish to apply it toward.</p>
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