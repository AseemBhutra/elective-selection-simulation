import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Welcome from './Welcome';
import ProgramSelection from './ProgramSelection';
import PGDM from './PGDM';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/courses" element={<ProgramSelection />} />
        <Route path="/pgpm" element={<App />} />
        <Route path="/pgdm" element={<PGDM />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
