'use client';

import { useState } from 'react';

export default function UrlShortener() {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/tools/url-shortener', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, customCode: customCode || undefined }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        setUrl('');
        setCustomCode('');
      } else {
        setError(data.error || 'Failed to shorten URL');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="tool-card">
      <h2>🔗 URL Shortener</h2>
      <p>Create short, custom links for easy sharing</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">URL to shorten:</label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="customCode">Custom code (optional):</label>
          <input
            id="customCode"
            type="text"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="my-custom-link"
            pattern="^[a-zA-Z0-9\-_]{3,20}$"
            title="3-20 characters: letters, numbers, hyphens, underscores only"
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading || !url}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {result && (
        <div className="result">
          <h3>✅ Success!</h3>
          <div className="result-item">
            <label>Short URL:</label>
            <div className="url-result">
              <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
                {result.shortUrl}
              </a>
              <button 
                onClick={() => copyToClipboard(result.shortUrl)}
                className="copy-btn"
                title="Copy to clipboard"
              >
                📋
              </button>
            </div>
          </div>
          <div className="result-item">
            <label>Original URL:</label>
            <span className="original-url">{result.originalUrl}</span>
          </div>
        </div>
      )}
    </div>
  );
}
