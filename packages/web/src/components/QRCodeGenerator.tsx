'use client';

import { useState } from 'react';
import { qrCodeApi } from '../lib/api';
import { ApiResponse, QRCodeResponse } from '../types/api';

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ApiResponse<QRCodeResponse> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await qrCodeApi.generateQRCode(text.trim());
      setResult(response);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.response?.data?.error || 'Failed to generate QR code'
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!result?.data?.qrCodeDataURL) return;
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = result.data.qrCodeDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="tool-card">
      <h2>📱 QR Code Generator</h2>
      <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
        Generate QR codes from any text, URL, or message
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="text" className="form-label">
            Enter text to generate QR code:
          </label>
          <textarea
            id="text"
            className="form-input form-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text, URL, message, or any content..."
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span className="loading">
              <span className="spinner"></span>
              Generating...
            </span>
          ) : (
            'Generate QR Code'
          )}
        </button>
      </form>

      {result && (
        <div className={`result-section ${result.success ? 'success' : 'error'}`}>
          {result.success && result.data ? (
            <>
              <div className="result-title">✅ QR Code generated successfully!</div>
              <div className="result-content">
                <p><strong>Text:</strong></p>
                <p style={{ wordBreak: 'break-word', marginBottom: '1rem' }}>
                  {result.data.text}
                </p>
                
                <div className="qr-code-container">
                  <img 
                    src={result.data.qrCodeDataURL} 
                    alt="Generated QR Code"
                    className="qr-code-image"
                  />
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button 
                    onClick={downloadQRCode}
                    className="btn btn-secondary"
                  >
                    💾 Download QR Code
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="result-title">❌ Error</div>
              <div className="result-content">
                {result.error || 'An unknown error occurred'}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
