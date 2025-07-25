'use client';

import { useState } from 'react';
import CopyNotification from './CopyNotification';

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;

    setLoading(true);
    setError('');
    setQrCode('');

    try {
      const response = await fetch('/api/tools/qr-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (data.success) {
        setQrCode(data.data.qrCodeDataURL);
      } else {
        setError(data.error || 'Failed to generate QR code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrCode) return;
    
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = qrCode;
    link.click();
  };

  const copyQRToClipboard = async () => {
    if (!qrCode) return;
    
    try {
      // Convert base64 to blob
      const response = await fetch(qrCode);
      const blob = await response.blob();
      
      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      
      setShowNotification(true);
    } catch (err) {
      // Fallback: copy the base64 data URL as text
      try {
        await navigator.clipboard.writeText(qrCode);
        setShowNotification(true);
      } catch (fallbackErr) {
        console.error('Failed to copy QR code:', fallbackErr);
      }
    }
  };

  return (
    <div className="tool-card">
      <h2>📱 QR Code Generator</h2>
      <p>Generate QR codes from text or URLs</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="qr-text">Text or URL:</label>
          <textarea
            id="qr-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text, URL, or any content..."
            rows={4}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading || !text}>
          {loading ? 'Generating...' : 'Generate QR Code'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {qrCode && (
        <div className="result">
          <h3>✅ QR Code Generated!</h3>
          <div className="qr-code-container">
            <img src={qrCode} alt="Generated QR Code" className="qr-code-image" />
            <div className="qr-actions">
              <button onClick={downloadQR} className="action-btn">
                📥 Download
              </button>
              <button onClick={copyQRToClipboard} className="action-btn">
                📋 Copy
              </button>
            </div>
          </div>
        </div>
      )}

      <CopyNotification 
        show={showNotification} 
        onHide={() => setShowNotification(false)} 
        message="QR Code copiado para área de transferência!"
      />
    </div>
  );
}
