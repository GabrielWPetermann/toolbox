'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const tools = [
    {
      id: 'url-shortener',
      name: 'URL Shortener',
      icon: '🔗',
      path: '/tools/url-shortener',
      description: 'Shorten long URLs'
    },
    {
      id: 'qr-code',
      name: 'QR Code Generator',
      icon: '📱',
      path: '/tools/qr-code',
      description: 'Generate QR codes'
    },
    {
      id: 'md-to-pdf',
      name: 'Markdown to PDF',
      icon: '📄',
      path: '/tools/md-to-pdf',
      description: 'Convert MD to PDF'
    }
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <Link href="/" className="nav-brand">
          <span className="nav-icon">🧰</span>
          <span className="nav-title">Toolbox</span>
        </Link>
      </div>
      
      <div className="nav-tools">
        {tools.map((tool) => (
          <Link 
            key={tool.id} 
            href={tool.path}
            className={`nav-tool ${pathname === tool.path ? 'active' : ''}`}
          >
            <span className="tool-icon">{tool.icon}</span>
            <div className="tool-info">
              <span className="tool-name">{tool.name}</span>
              <span className="tool-desc">{tool.description}</span>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
