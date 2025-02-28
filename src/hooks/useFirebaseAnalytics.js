import { useState, useEffect, useCallback } from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

export const useFirebaseAnalytics = () => {
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
      logEvent(analytics, eventName, {
        timestamp: new Date().toISOString(),
        ...eventParams
      });
    }
  }, [analytics]);

  return logAnalyticsEvent;
}; 