import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
        <Route path="/home" element={<Welcome />} />
        <Route path="/courses" element={<ProgramSelection />} />
        <Route path="/pgpm" element={<App />} />
        <Route path="/pgdm" element={<PGDM />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
