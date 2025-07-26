'use client';

import { useState } from 'react';
import CopyNotification from './CopyNotification';

export default function TextComparer() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [compareType, setCompareType] = useState('lines');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text1.trim() || !text2.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/tools/text-comparer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text1: text1.trim(), 
          text2: text2.trim(),
          compareType 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to compare texts');
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

  const loadSampleTexts = () => {
    setText1(`Hello world!
This is the first text.
It has multiple lines.
Some content here.`);
    
    setText2(`Hello world!
This is the second text.
It has multiple lines.
Different content here.`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'equal': return '#28a745';
      case 'different': return '#ffc107';
      case 'added': return '#17a2b8';
      case 'removed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'equal': return '✓';
      case 'different': return '⚠';
      case 'added': return '+';
      case 'removed': return '-';
      default: return '?';
    }
  };

  return (
    <div className="text-comparer-container">
      <div className="text-input-section">
        <div className="tool-card">
          <h2>📝 Text Comparer</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="compare-type-selector">
              <label>Compare by:</label>
              <select 
                value={compareType} 
                onChange={(e) => setCompareType(e.target.value)}
                disabled={loading}
              >
                <option value="lines">Lines</option>
                <option value="words">Words</option>
                <option value="characters">Characters</option>
              </select>
            </div>

            <div className="texts-container">
              <div className="text-input-group">
                <label htmlFor="text1">Text 1:</label>
                <textarea
                  id="text1"
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                  placeholder="Enter first text here..."
                  rows={12}
                  required
                  disabled={loading}
                />
              </div>

              <div className="text-input-group">
                <label htmlFor="text2">Text 2:</label>
                <textarea
                  id="text2"
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  placeholder="Enter second text here..."
                  rows={12}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="button-group">
              <button type="submit" disabled={loading || !text1.trim() || !text2.trim()}>
                {loading ? 'Comparing...' : 'Compare Texts'}
              </button>
              
              <button 
                type="button" 
                onClick={loadSampleTexts}
                className="action-btn"
                disabled={loading}
              >
                📝 Load Sample
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
        <div className="comparison-result-section">
          <div className="tool-card">
            <h2>📊 Comparison Results</h2>
            
            <div className="comparison-stats">
              <div className="stat-item">
                <label>Text 1 Length:</label>
                <span>{result.stats.text1Length} characters</span>
              </div>
              <div className="stat-item">
                <label>Text 2 Length:</label>
                <span>{result.stats.text2Length} characters</span>
              </div>
              <div className="stat-item">
                <label>Similarity:</label>
                <span>{result.stats.similarity}%</span>
              </div>
            </div>

            <div className="comparison-results">
              <h3>🔍 Detailed Comparison</h3>
              <div className="comparison-legend">
                <span className="legend-item equal">✓ Equal</span>
                <span className="legend-item different">⚠ Different</span>
                <span className="legend-item added">+ Added</span>
                <span className="legend-item removed">- Removed</span>
              </div>
              
              <div className="comparison-list">
                {result.comparison.map((item, index) => (
                  <div 
                    key={index} 
                    className={`comparison-item ${item.status}`}
                    style={{ borderLeft: `4px solid ${getStatusColor(item.status)}` }}
                  >
                    <div className="comparison-header">
                      <span className="status-icon">{getStatusIcon(item.status)}</span>
                      <span className="item-number">
                        {compareType === 'lines' ? `Line ${item.lineNumber}` :
                         compareType === 'words' ? `Word ${item.position}` :
                         `Char ${item.position}`}
                      </span>
                    </div>
                    
                    <div className="comparison-content">
                      <div className="text-1">
                        <strong>Text 1:</strong> 
                        <span>{compareType === 'lines' ? item.text1 : 
                               compareType === 'words' ? item.word1 : 
                               item.char1 || '(empty)'}</span>
                      </div>
                      <div className="text-2">
                        <strong>Text 2:</strong> 
                        <span>{compareType === 'lines' ? item.text2 : 
                               compareType === 'words' ? item.word2 : 
                               item.char2 || '(empty)'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
