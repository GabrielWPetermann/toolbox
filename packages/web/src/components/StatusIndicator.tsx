'use client';

import { useState, useEffect } from 'react';
import { healthApi } from '../lib/api';

export default function StatusIndicator() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<string>('');

  const checkApiStatus = async () => {
    try {
      await healthApi.check();
      setIsOnline(true);
      setLastCheck(new Date().toLocaleTimeString());
    } catch (error) {
      setIsOnline(false);
      setLastCheck(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (isOnline === null) {
    return (
      <div className="status-indicator">
        <span className="spinner"></span>
        Checking API status...
      </div>
    );
  }

  return (
    <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
      <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
      {isOnline ? (
        <span>API Online - Last checked: {lastCheck}</span>
      ) : (
        <span>API Offline - Last checked: {lastCheck}</span>
      )}
    </div>
  );
}
