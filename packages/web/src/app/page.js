import StatusIndicator from '../components/StatusIndicator';
import UrlShortener from '../components/UrlShortener';
import QRCodeGenerator from '../components/QRCodeGenerator';

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="container">
          <h1>🧰 Toolbox Web</h1>
          <p>Simple and useful web tools for everyday tasks</p>
          <StatusIndicator />
        </div>
      </header>

      <main className="container">
        <div className="tools-grid">
          <UrlShortener />
          <QRCodeGenerator />
        </div>
        
        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#6b7280' }}>
          <p>More tools coming soon! 🚀</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Built with Next.js, React, and Express
          </p>
        </div>
      </main>
    </>
  );
}
