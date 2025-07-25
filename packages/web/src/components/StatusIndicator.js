'use client';

import { useState, useEffect } from 'react';

export default function StatusIndicator() {
  const [isOnline, setIsOnline] = useState(null);
  const [lastCheck, setLastCheck] = useState('');

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
      setLastCheck(new Date().toLocaleTimeString());
    } catch (error) {
      setIsOnline(false);
      setLastCheck(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      fontSize: '0.875rem',
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: isOnline === null ? '#fbbf24' : isOnline ? '#10b981' : '#ef4444'
      }} />
      <span>
        {isOnline === null ? 'Checking...' : isOnline ? 'API Online' : 'API Offline'}
        {lastCheck && ` (${lastCheck})`}
      </span>
    </div>
  );
}
