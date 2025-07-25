'use client';

import { useState } from 'react';
import { urlShortenerApi } from '@/lib/api';
import { ApiResponse, UrlShortenerResponse } from '@/types/api';

export default function UrlShortener() {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [result, setResult] = useState<ApiResponse<UrlShortenerResponse> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await urlShortenerApi.shortenUrl(url.trim(), customCode.trim() || undefined);
      setResult(response);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.response?.data?.error || 'Failed to shorten URL'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleCustomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow valid characters: letters, numbers, hyphens, underscores
    const value = e.target.value.replace(/[^a-zA-Z0-9\-_]/g, '');
    setCustomCode(value);
  };

  return (
    <div className="tool-card">
      <h2>🔗 URL Shortener</h2>
      <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
        Shorten long URLs with optional custom codes
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url" className="form-label">
            Enter URL to shorten:
          </label>
          <input
            type="url"
            id="url"
            className="form-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customCode" className="form-label">
            Custom code (optional):
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>toolbox.dev/</span>
            <input
              type="text"
              id="customCode"
              className="form-input"
              value={customCode}
              onChange={handleCustomCodeChange}
              placeholder="my-custom-link"
              style={{ flex: 1 }}
              maxLength={20}
            />
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
            3-20 characters, letters, numbers, hyphens and underscores only
          </p>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span className="loading">
              <span className="spinner"></span>
              Shortening...
            </span>
          ) : (
            'Shorten URL'
          )}
        </button>
      </form>

      {result && (
        <div className={`result-section ${result.success ? 'success' : 'error'}`}>
          {result.success && result.data ? (
            <>
              <div className="result-title">
                ✅ URL shortened successfully! 
                {result.data.isCustom && <span style={{ color: '#10b981' }}> (Custom)</span>}
              </div>
              <div className="result-content">
                <p><strong>Original URL:</strong></p>
                <p style={{ wordBreak: 'break-all', marginBottom: '1rem' }}>
                  {result.data.originalUrl}
                </p>
                
                <p><strong>Short URL:</strong></p>
                <p style={{ marginBottom: '1rem' }}>
                  <a 
                    href={result.data.shortUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="result-link"
                  >
                    {result.data.shortUrl}
                  </a>
                </p>
                
                <button 
                  onClick={() => copyToClipboard(result.data!.shortUrl)}
                  className="btn btn-secondary"
                >
                  📋 Copy Short URL
                </button>
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
