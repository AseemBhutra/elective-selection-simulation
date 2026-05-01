import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function PageTransition({ children }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [stage, setStage] = useState('enter'); // 'enter' | 'exit'
  const ref = useRef(null);

  useEffect(() => {
    if (children !== displayChildren) {
      setStage('exit');
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setStage('enter');
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [children, displayChildren]);

  useEffect(() => {
    // Reset scroll on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div
      ref={ref}
      className={`page-transition page-${stage}`}
      key={location.pathname}
    >
      {displayChildren}
    </div>
  );
}

export default PageTransition;
