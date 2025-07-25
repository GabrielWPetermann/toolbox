'use client';

import { useEffect } from 'react';

export default function CopyNotification({ show, onHide, message = "Copiado para área de transferência!" }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  if (!show) return null;

  return (
    <div className="copy-notification">
      <div className="copy-notification-content">
        <span className="copy-notification-icon">✅</span>
        <span className="copy-notification-text">{message}</span>
      </div>
    </div>
  );
}
