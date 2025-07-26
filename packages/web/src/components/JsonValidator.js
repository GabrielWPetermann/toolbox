'use client';

import { useState } from 'react';
import CopyNotification from './CopyNotification';

export default function JsonValidator() {
  const [jsonText, setJsonText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jsonText.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/tools/json-validator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonText: jsonText.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to validate JSON');
      }
    } catch (err) {
      console.error('Network/request error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowNotification(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sampleJson = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": ["reading", "coding", "traveling"],
  "isActive": true
}`;

  return (
    <div className="json-validator-container">
      <div className="json-input-section">
        <div className="tool-card">
          <h2>🔍 JSON Validator</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="jsonText">JSON Content:</label>
              <div className="textarea-with-sample">
                <textarea
                  id="jsonText"
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder="Paste your JSON here to validate..."
                  rows={15}
                  required
                  disabled={loading}
                />
                <button 
                  type="button" 
                  onClick={() => setJsonText(sampleJson)}
                  className="sample-btn"
                  disabled={loading}
                >
                  📝 Load Sample
                </button>
              </div>
            </div>

            <div className="button-group">
              <button type="submit" disabled={loading || !jsonText.trim()}>
                {loading ? 'Validating...' : 'Validate JSON'}
              </button>
            </div>
          </form>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="json-result-section">
          <div className="tool-card">
            <h2>{result.valid ? '✅ Valid JSON' : '❌ Invalid JSON'}</h2>
            
            {result.valid ? (
              <>
                <div className="json-stats">
                  <div className="stat-item">
                    <label>Type:</label>
                    <span>{result.stats.type}</span>
                  </div>
                  <div className="stat-item">
                    <label>Size:</label>
                    <span>{result.stats.size} characters</span>
                  </div>
                  {result.stats.keys > 0 && (
                    <div className="stat-item">
                      <label>Keys:</label>
                      <span>{result.stats.keys}</span>
                    </div>
                  )}
                  <div className="stat-item">
                    <label>Depth:</label>
                    <span>{result.stats.levels} levels</span>
                  </div>
                </div>

                <div className="formatted-json">
                  <h3>📄 Formatted JSON</h3>
                  <div className="json-output">
                    <pre>{result.formatted}</pre>
                    <button 
                      onClick={() => copyToClipboard(result.formatted)}
                      className="copy-btn"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="json-error">
                <div className="error-details">
                  <p><strong>Error:</strong> {result.error}</p>
                  {result.line && (
                    <p><strong>Location:</strong> Line {result.line}, Column {result.column}</p>
                  )}
                  {result.position && (
                    <p><strong>Position:</strong> Character {result.position}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <CopyNotification 
        show={showNotification} 
        onHide={() => setShowNotification(false)} 
        message="Copied to clipboard!"
      />
    </div>
  );
}
