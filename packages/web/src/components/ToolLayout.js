'use client';

import Navigation from './Navigation';
import StatusIndicator from './StatusIndicator';

export default function ToolLayout({ children, title, description }) {
  return (
    <div className="app-container">
      <Navigation />
      
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
