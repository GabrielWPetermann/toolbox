'use client';

import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import StatusIndicator from './StatusIndicator';

export default function ToolLayout({ children, title, description }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="app-container">
      {isMobile && (
        <header className="mobile-header">
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <div className="mobile-brand">
            <span className="nav-icon">🧰</span>
            <span className="nav-title">Toolbox</span>
          </div>
        </header>
      )}

      <Navigation 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      <main className="main-content">
        <header className="tool-header">
          <div className="container">
            <h1>{title}</h1>
            <p>{description}</p>
            <StatusIndicator />
          </div>
        </header>

        <section className="tool-content">
          <div className="container">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
