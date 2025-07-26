import Link from 'next/link';
import StatusIndicator from '../components/StatusIndicator';

export default function Home() {
  const tools = [
    {
      id: 'url-shortener',
      name: 'URL Shortener',
      icon: '🔗',
      path: '/tools/url-shortener',
      description: 'Create short links using TinyURL for easy sharing',
      features: ['TinyURL Integration', 'One-click Copy', 'Instant Results']
    },
    {
      id: 'qr-code',
      name: 'QR Code Generator',
      icon: '📱',
      path: '/tools/qr-code',
      description: 'Generate QR codes from any text or URL',
      features: ['High Quality PNG', 'Download & Copy', 'Live Preview']
    },
    {
      id: 'md-to-pdf',
      name: 'Markdown to PDF',
      icon: '📄',
      path: '/tools/md-to-pdf',
      description: 'Convert Markdown text to professionally formatted PDF',
      features: ['Professional Styling', 'PDF Preview', 'Custom Filename']
    }
  ];

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
        <div className="tools-showcase">
          {tools.map((tool) => (
            <Link key={tool.id} href={tool.path} className="tool-showcase-card">
              <div className="tool-showcase-icon">
                {tool.icon}
              </div>
              <div className="tool-showcase-content">
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <ul className="tool-features">
                  {tool.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
                <div className="tool-cta">
                  <span>Get Started →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#ffffffe6' }}>
          <p>Professional tools with modern glassmorphism design! 🚀</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Built with Next.js, React, and modern web technologies
          </p>
        </div>
      </main>
    </>
  );
}
