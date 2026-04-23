import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebaseAnalytics } from "../hooks/useFirebaseAnalytics";
import "./ElectiveSimulator.css";

function ElectiveSimulator({ config }) {
  const {
    programName,
    totalElectives,
    terms,
    termLimits,
    majorCategories,
    functionalAreas,
    specialization,
    usesRangeLimits,
    prerequisites,
    dependentCourses,
    mutuallyExclusive,
    requireOpenElective,
    electivesData,
  } = config;

  const navigate = useNavigate();
  const logAnalyticsEvent = useFirebaseAnalytics();

  // Build initial state for selected electives per term
  const initialSelected = {};
  terms.forEach((t) => (initialSelected[t] = []));

  const [selectedElectives, setSelectedElectives] = useState(initialSelected);
  const [popup, setPopup] = useState({ visible: false, elective: null, term: null });
  const [messagePopup, setMessagePopup] = useState({ visible: false, message: "", type: "", title: "" });
  const [showSubjects, setShowSubjects] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [filterMajor, setFilterMajor] = useState(null);

  useEffect(() => {
    logAnalyticsEvent("page_view", {
      page_title: `${programName} Elective Simulation`,
      page_location: window.location.href,
    });
  }, [logAnalyticsEvent, programName]);

  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Helpers ──────────────────────────────────────────────

  const getColorForCategory = (category) => {
    const found = majorCategories.find((c) => c.name === category);
    return found ? found.color : "#e0e0e0";
  };

  const allSelected = () => Object.values(selectedElectives).flat();

  const showMsg = (message, type = "info", title = "Message") => {
    setMessagePopup({ visible: true, message, type, title });
  };

  // ── Specialization logic ─────────────────────────────────

  const determineMajorMinor = () => {
    const counts = {};
    allSelected().forEach((elective) => {
      elective.major.split(",").map((m) => m.trim()).forEach((major) => {
        if (major !== "Open Elective") {
          counts[major] = (counts[major] || 0) + 1;
        }
      });
    });

    const { majorThreshold, minorThreshold, generalManagementThreshold } = specialization;

    const isGeneralMgmt = functionalAreas.every(
      (area) => (counts[area] || 0) >= generalManagementThreshold
    );
    const majorAreas = Object.entries(counts)
      .filter(([area, count]) => count >= majorThreshold && functionalAreas.includes(area))
      .map(([area]) => area);
    const minorAreas = Object.entries(counts)
      .filter(
        ([area, count]) =>
          count >= minorThreshold &&
          count < majorThreshold &&
          functionalAreas.includes(area) &&
          !majorAreas.includes(area)
      )
      .map(([area]) => area);

    if (isGeneralMgmt) {
      return {
        text: `General Management (${generalManagementThreshold}+ courses in each functional area)`,
        jsx: (
          <>
            <strong>General Management</strong>
            <br />
            <small>{generalManagementThreshold}+ courses in each functional area</small>
          </>
        ),
      };
    }
    if (majorAreas.length >= 2) {
      return {
        text: `Double Major: ${majorAreas[0]} and ${majorAreas[1]}`,
        jsx: (
          <span>
            <strong>Double Major:</strong> {majorAreas[0]} &amp; {majorAreas[1]}
          </span>
        ),
      };
    }
    if (majorAreas.length === 1 && minorAreas.length >= 1) {
      return {
        text: `Major: ${majorAreas[0]}, Minor: ${minorAreas[0]}`,
        jsx: (
          <span>
            Major in <strong>{majorAreas[0]}</strong>, Minor in <strong>{minorAreas[0]}</strong>
          </span>
        ),
      };
    }
    if (majorAreas.length === 1) {
      return {
        text: `Major: ${majorAreas[0]}`,
        jsx: (
          <span>
            Major in <strong>{majorAreas[0]}</strong>
          </span>
        ),
      };
    }
    if (minorAreas.length >= 1) {
      return {
        text: `Minor: ${minorAreas[0]} (add more for a Major)`,
        jsx: (
          <span>
            Minor in <strong>{minorAreas[0]}</strong>
            <br />
            <small>Add more electives to qualify for a Major</small>
          </span>
        ),
      };
    }
    return {
      text: "Not determined yet — select more electives",
      jsx: (
        <span>
          <strong>Not determined yet</strong>
          <br />
          <small>Select more electives to qualify for a Major or Minor</small>
        </span>
      ),
    };
  };

  // ── Selection / Deselection ──────────────────────────────

  const canRemoveElective = (elective) => {
    const deps = dependentCourses[elective.name] || [];
    const blockers = allSelected().filter((c) => deps.includes(c.name));
    if (blockers.length > 0) {
      return {
        canRemove: false,
        message: `Cannot remove "${elective.name}" — it is a prerequisite for: ${blockers.map((b) => b.name).join(", ")}. Remove those first.`,
      };
    }
    return { canRemove: true };
  };

  const arePrereqsMet = (elective) => {
    const reqs = prerequisites[elective.name];
    if (!reqs) return { satisfied: true };
    const names = allSelected().map((e) => e.name);
    const missing = reqs.filter((r) => !names.includes(r));
    if (missing.length > 0) {
      return {
        satisfied: false,
        message: `Prerequisite required: select "${missing.join('", "')}" before "${elective.name}".`,
      };
    }
    return { satisfied: true };
  };

  const checkMutualExclusion = (elective) => {
    for (const pair of mutuallyExclusive) {
      const otherName = pair.find((n) => n !== elective.name);
      if (otherName && pair.includes(elective.name)) {
        if (allSelected().some((e) => e.name === otherName)) {
          return {
            blocked: true,
            message: `"${elective.name}" and "${otherName}" are mutually exclusive. Remove one to select the other.`,
          };
        }
      }
    }
    return { blocked: false };
  };

  const handleSelectElective = (term, elective) => {
    const isSelected = selectedElectives[term].some((e) => e.name === elective.name);

    logAnalyticsEvent(`${programName.toLowerCase()}_elective_interaction`, {
      action: isSelected ? "deselect" : "select",
      term,
      elective_name: elective.name,
      elective_major: elective.major,
      is_cross_listed: elective.crossListed || false,
    });

    if (isSelected) {
      handleDeselect(term, elective);
      return;
    }

    if (elective.crossListed) {
      setPopup({ visible: true, elective, term });
      return;
    }

    handleSelect(term, elective);
  };

  const handleDeselect = (term, elective) => {
    const result = canRemoveElective(elective);
    if (!result.canRemove) {
      showMsg(result.message, "error", "Cannot Remove");
      return;
    }
    setSelectedElectives((prev) => ({
      ...prev,
      [term]: prev[term].filter((e) => e.name !== elective.name),
    }));
  };

  const handleSelect = (term, elective) => {
    // prereqs
    const prereqCheck = arePrereqsMet(elective);
    if (!prereqCheck.satisfied) {
      showMsg(prereqCheck.message, "error", "Prerequisite Missing");
      return;
    }

    // mutual exclusion
    const meCheck = checkMutualExclusion(elective);
    if (meCheck.blocked) {
      showMsg(meCheck.message, "error", "Mutually Exclusive");
      return;
    }

    // term limit
    const max = termLimits[term].max;
    if (selectedElectives[term].length >= max) {
      showMsg(
        usesRangeLimits
          ? `Maximum ${max} electives for Term ${term}.`
          : `Term ${term} requires exactly ${max} electives. Remove one before adding another.`,
        "error",
        "Term Limit Reached"
      );
      return;
    }

    // total limit
    if (allSelected().length >= totalElectives) {
      showMsg(`Maximum of ${totalElectives} electives reached.`, "error", "Limit Reached");
      return;
    }

    setSelectedElectives((prev) => ({
      ...prev,
      [term]: [...prev[term], elective],
    }));
  };

  const handlePopupSelection = (category) => {
    const { elective, term } = popup;
    logAnalyticsEvent(`${programName.toLowerCase()}_cross_listed`, {
      elective_name: elective.name,
      selected_category: category,
      term,
    });
    const updatedElective = {
      ...elective,
      major: category,
      color: getColorForCategory(category),
    };
    handleSelect(term, updatedElective);
    setPopup({ visible: false, elective: null, term: null });
  };

  // ── Validation ───────────────────────────────────────────

  const handleCheck = () => {
    const spec = determineMajorMinor();
    logAnalyticsEvent(`${programName.toLowerCase()}_validate`, {
      total_selected: allSelected().length,
      outcome: spec.text,
    });

    const errors = [];
    const total = allSelected().length;

    if (total !== totalElectives) {
      errors.push(`${totalElectives} electives required — you have ${total}.`);
    }

    terms.forEach((term) => {
      const count = selectedElectives[term].length;
      const { min, max } = termLimits[term];
      if (usesRangeLimits) {
        if (count < min) errors.push(`Term ${term}: need at least ${min} (have ${count}).`);
        else if (count > max) errors.push(`Term ${term}: max ${max} (have ${count}).`);
      } else {
        if (count !== max) errors.push(`Term ${term}: exactly ${max} required (have ${count}).`);
      }
    });

    if (requireOpenElective) {
      const hasOpen = allSelected().some((e) => e.major.includes("Open Elective"));
      if (!hasOpen) errors.push("At least one Open Elective is required.");
    }

    // Check specialization validity
    const counts = {};
    allSelected().forEach((e) => {
      e.major.split(",").map((m) => m.trim()).forEach((major) => {
        if (major !== "Open Elective") counts[major] = (counts[major] || 0) + 1;
      });
    });
    const hasMajor = Object.entries(counts).some(
      ([area, count]) => count >= specialization.majorThreshold && functionalAreas.includes(area)
    );
    const hasGenMgmt = functionalAreas.every(
      (area) => (counts[area] || 0) >= specialization.generalManagementThreshold
    );
    if (!hasMajor && !hasGenMgmt && total === totalElectives) {
      errors.push(
        `To specialize, you need ${specialization.majorThreshold}+ courses in one area for a Major, or ${specialization.generalManagementThreshold}+ in each area for General Management.`
      );
    }

    if (errors.length > 0) {
      showMsg(errors, "error", "Please Review Your Selection");
    } else {
      showMsg([spec.text], "success", "Valid Selection!");
      setShowSubjects(false);
    }
  };

  // ── Reset / Download / Misc ──────────────────────────────

  const handleReset = () => {
    logAnalyticsEvent(`${programName.toLowerCase()}_reset`, { total_selected: allSelected().length });
    const cleared = {};
    terms.forEach((t) => (cleared[t] = []));
    setSelectedElectives(cleared);
  };

  const handleDownload = () => {
    const spec = determineMajorMinor();
    logAnalyticsEvent(`${programName.toLowerCase()}_download`, {
      total_selected: allSelected().length,
      specialization: spec.text,
    });
    const lines = [`${programName} Elective Selection Report`, spec.text, ""];
    Object.entries(selectedElectives).forEach(([term, electives]) => {
      if (electives.length > 0) {
        lines.push(`Term ${term}:`);
        electives.forEach((e) => lines.push(`  ${e.name} (${e.major})`));
        lines.push("");
      }
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${programName}_Elective_Selection.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-container") {
      setPopup({ visible: false, elective: null, term: null });
      setMessagePopup({ visible: false, message: "", type: "", title: "" });
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ── Area counts for dashboard ────────────────────────────

  const areaCounts = {};
  allSelected().forEach((e) => {
    e.major.split(",").map((m) => m.trim()).forEach((major) => {
      areaCounts[major] = (areaCounts[major] || 0) + 1;
    });
  });

  const totalSelected = allSelected().length;
  const spec = determineMajorMinor();

  // ── Render helpers ───────────────────────────────────────

  const renderPopupMessage = () => {
    if (!messagePopup.message) return null;
    const isSuccess = messagePopup.type === "success";

    return (
      <>
        <div className="sim-popup-message-body">
          {Array.isArray(messagePopup.message) ? (
            <ul className="sim-validation-list">
              {messagePopup.message.map((msg, i) => (
                <li key={i} className="sim-validation-item">{msg}</li>
              ))}
            </ul>
          ) : (
            <p>{messagePopup.message}</p>
          )}

          {isSuccess && showSubjects && (
            <div className="sim-selected-subjects">
              <strong>Selected Electives:</strong>
              {Object.entries(selectedElectives).map(([term, electives]) =>
                electives.length > 0 ? (
                  <div key={term}>
                    <p className="sim-term-label">Term {term}</p>
                    <ul>
                      {electives.map((e) => (
                        <li key={e.name}>
                          {e.name} <span className="sim-subject-major">({e.major})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>

        <div className="sim-popup-actions">
          {isSuccess ? (
            <>
              <button className="sim-btn sim-btn-secondary" onClick={() => setShowSubjects(!showSubjects)}>
                {showSubjects ? "Hide Electives" : "View Electives"}
              </button>
              <button className="sim-btn sim-btn-secondary" onClick={handleDownload}>
                Download Report
              </button>
            </>
          ) : (
            <button
              className="sim-btn sim-btn-secondary"
              onClick={() => setMessagePopup({ visible: false, message: "", type: "", title: "" })}
            >
              Close
            </button>
          )}
        </div>
      </>
    );
  };

  // ── Render ───────────────────────────────────────────────

  return (
    <div className="sim-container">
      {/* Header */}
      <header className="sim-header">
        <div className="sim-header-left">
          <button className="sim-back-btn" onClick={() => navigate("/courses")} aria-label="Back to program selection">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div>
            <h1>{programName} Elective Simulator</h1>
            <span className="sim-header-subtitle">
              {totalSelected} / {totalElectives} electives selected
            </span>
          </div>
        </div>
        <div className="sim-header-actions">
          <button className="sim-btn sim-btn-primary" onClick={handleCheck}>
            Validate Selection
          </button>
          <button className="sim-btn sim-btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </header>

      <div className="sim-body">
        {/* Left — Term cards */}
        <main className="sim-terms">
          {terms.map((term) => {
            const termElectives = electivesData[term] || [];
            const selected = selectedElectives[term] || [];
            const limit = termLimits[term];
            const isFull = selected.length >= limit.max;

            return (
              <section key={term} className="sim-term-card">
                <div className="sim-term-card-header">
                  <h2>Term {term}</h2>
                  <div className="sim-term-meta">
                    <span className={`sim-term-badge ${isFull ? "full" : ""}`}>
                      {selected.length} / {usesRangeLimits ? `${limit.min}–${limit.max}` : limit.max}
                    </span>
                  </div>
                </div>

                <div className="sim-electives-grid">
                  {termElectives
                    .filter((el) => {
                      if (!filterMajor) return true;
                      return el.major.split(",").map((m) => m.trim()).includes(filterMajor);
                    })
                    .map((elective) => {
                      const isSelected = selected.find((e) => e.name === elective.name);
                      const bgColor = isSelected ? isSelected.color : "";
                      const majors = elective.major.split(",").map((m) => m.trim());

                      return (
                        <div
                          key={elective.name}
                          className={`sim-tile ${isSelected ? "selected" : ""} ${!isSelected && isFull ? "disabled" : ""}`}
                          style={isSelected ? { backgroundColor: bgColor } : {}}
                          onClick={() => handleSelectElective(term, elective)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleSelectElective(term, elective); }}
                          aria-pressed={!!isSelected}
                          aria-label={`${elective.name} — ${elective.major}`}
                        >
                          {isSelected && <span className="sim-tile-check">✓</span>}
                          <span className="sim-tile-name">{elective.name}</span>
                          <div className="sim-tile-tags">
                            {majors.map((m) => (
                              <span key={m} className="sim-tile-tag" style={{ backgroundColor: getColorForCategory(m) }}>
                                {m}
                              </span>
                            ))}
                          </div>
                          {elective.crossListed && <span className="sim-cross-badge" title="Cross-listed course">⇌</span>}
                        </div>
                      );
                    })}
                </div>
              </section>
            );
          })}
        </main>

        {/* Right — Dashboard */}
        <aside className="sim-dashboard">
          {/* Progress */}
          <div className="sim-dash-card">
            <h3>Selection Progress</h3>
            <div className="sim-progress-bar">
              <div
                className="sim-progress-fill"
                style={{ width: `${Math.min((totalSelected / totalElectives) * 100, 100)}%` }}
              />
            </div>
            <div className="sim-progress-stats">
              <div>
                <span className="sim-stat-value">{totalSelected}</span>
                <span className="sim-stat-label">Selected</span>
              </div>
              <div>
                <span className="sim-stat-value">{Math.max(totalElectives - totalSelected, 0)}</span>
                <span className="sim-stat-label">Remaining</span>
              </div>
            </div>

            {/* Per-term mini bars */}
            <div className="sim-term-progress-list">
              {terms.map((term) => {
                const count = (selectedElectives[term] || []).length;
                const target = termLimits[term].max;
                const pct = Math.min((count / target) * 100, 100);
                return (
                  <div key={term} className="sim-term-progress-row">
                    <span className="sim-term-progress-label">T{term}</span>
                    <div className="sim-term-progress-track">
                      <div className="sim-term-progress-bar" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="sim-term-progress-count">{count}/{target}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Specialization Outcome */}
          <div className="sim-dash-card">
            <h3>Specialization Outcome</h3>
            <div className="sim-outcome">{spec.jsx}</div>
          </div>

          {/* Area breakdown */}
          <div className="sim-dash-card">
            <h3>Area Breakdown</h3>
            <div className="sim-area-list">
              {majorCategories.map((cat) => {
                const count = areaCounts[cat.name] || 0;
                const isFA = functionalAreas.includes(cat.name);
                const threshold = isFA ? specialization.majorThreshold : 0;
                return (
                  <button
                    key={cat.name}
                    className={`sim-area-row ${filterMajor === cat.name ? "active" : ""}`}
                    onClick={() => setFilterMajor(filterMajor === cat.name ? null : cat.name)}
                    title={filterMajor === cat.name ? "Click to clear filter" : `Click to filter by ${cat.name}`}
                  >
                    <span className="sim-area-dot" style={{ backgroundColor: cat.color }} />
                    <span className="sim-area-name">{cat.name}</span>
                    <span className="sim-area-count">
                      {count}{isFA && threshold > 0 ? ` / ${threshold}` : ""}
                    </span>
                  </button>
                );
              })}
              {filterMajor && (
                <button className="sim-clear-filter" onClick={() => setFilterMajor(null)}>
                  Clear filter
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Cross-listed popup */}
      {popup.visible && (
        <div id="popup-container" className="sim-overlay" onClick={handleOutsideClick}>
          <div className="sim-popup">
            <h3>Choose Specialization Area</h3>
            <p className="sim-popup-subtitle">
              <strong>{popup.elective.name}</strong> is cross-listed. Pick which area to count it toward:
            </p>
            <div className="sim-popup-options">
              {popup.elective.major.split(",").map((cat) => (
                <button
                  key={cat}
                  className="sim-category-btn"
                  style={{ backgroundColor: getColorForCategory(cat.trim()), borderColor: getColorForCategory(cat.trim()) }}
                  onClick={() => handlePopupSelection(cat.trim())}
                >
                  {cat.trim()}
                </button>
              ))}
            </div>
            <button
              className="sim-btn sim-btn-secondary sim-popup-cancel"
              onClick={() => setPopup({ visible: false, elective: null, term: null })}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Message popup */}
      {messagePopup.visible && (
        <div id="popup-container" className="sim-overlay" onClick={handleOutsideClick}>
          <div className={`sim-popup ${messagePopup.type || ""}`}>
            <h3 className={`sim-popup-title ${messagePopup.type || ""}`}>
              {messagePopup.type === "success" && "✓ "}
              {messagePopup.type === "error" && "✗ "}
              {messagePopup.title || "Message"}
            </h3>
            {renderPopupMessage()}
          </div>
        </div>
      )}

      {/* Scroll to top */}
      {showButton && (
        <button className="sim-scroll-top" onClick={scrollToTop} aria-label="Scroll to top">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default ElectiveSimulator;
