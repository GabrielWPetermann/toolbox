'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navigation({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToolClick = () => {
    if (isMobile && setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

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
    },
    {
      id: 'json-validator',
      name: 'JSON Validator',
      icon: '✅',
      path: '/tools/json-validator',
      description: 'Validate JSON format'
    },
    {
      id: 'text-comparer',
      name: 'Text Comparer',
      icon: '🔀',
      path: '/tools/text-comparer',
      description: 'Compare text differences'
    },
    {
      id: 'color-palette',
      name: 'Color Palette',
      icon: '🎨',
      path: '/tools/color-palette',
      description: 'Generate color palettes'
    }
  ];

  return (
    <>
      {isMobile && isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
        />
      )}
      
      <nav className={`navigation ${isMobile && isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="nav-header">
          <Link href="/" className="nav-brand" onClick={handleToolClick}>
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
              onClick={handleToolClick}
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
    </>
  );
}
