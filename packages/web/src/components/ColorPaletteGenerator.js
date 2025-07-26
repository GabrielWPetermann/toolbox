'use client';

import { useState, useRef } from 'react';
import CopyNotification from './CopyNotification';

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#3498db');
  const [paletteType, setPaletteType] = useState('complementary');
  const [count, setCount] = useState(5);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const colorInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!baseColor) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/tools/color-palette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          baseColor: baseColor,
          paletteType: paletteType,
          count: parseInt(count)
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to generate color palette');
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

  const copyPalette = async (format) => {
    if (!result) return;
    
    let paletteText = '';
    
    switch (format) {
      case 'hex':
        paletteText = result.palette.map(color => color.hex).join('\n');
        break;
      case 'rgb':
        paletteText = result.palette.map(color => `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`).join('\n');
        break;
      case 'hsl':
        paletteText = result.palette.map(color => color.css).join('\n');
        break;
      case 'css':
        paletteText = result.palette.map((color, index) => 
          `--color-${index + 1}: ${color.hex};`
        ).join('\n');
        break;
      default:
        paletteText = result.palette.map(color => color.hex).join('\n');
    }
    
    await copyToClipboard(paletteText);
  };

  const paletteTypes = [
    { value: 'complementary', label: 'Complementary', description: 'Opposite colors on the color wheel' },
    { value: 'analogous', label: 'Analogous', description: 'Adjacent colors on the color wheel' },
    { value: 'triadic', label: 'Triadic', description: 'Three evenly spaced colors' },
    { value: 'monochromatic', label: 'Monochromatic', description: 'Variations of the same hue' },
    { value: 'tetradic', label: 'Tetradic', description: 'Four colors forming a rectangle' }
  ];

  return (
    <div className="color-palette-container">
      <div className="color-input-section">
        <div className="tool-card">
          <h2>🎨 Color Palette Generator</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="baseColor">Base Color:</label>
              <div className="color-picker-container">
                <input
                  ref={colorInputRef}
                  id="baseColor"
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  disabled={loading}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  placeholder="#3498db"
                  disabled={loading}
                  className="color-input"
                />
                <div 
                  className="color-preview" 
                  style={{ backgroundColor: baseColor }}
                  onClick={() => colorInputRef.current?.click()}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="paletteType">Palette Type:</label>
              <select 
                id="paletteType"
                value={paletteType} 
                onChange={(e) => setPaletteType(e.target.value)}
                disabled={loading}
              >
                {paletteTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="palette-description">
                {paletteTypes.find(t => t.value === paletteType)?.description}
              </p>
            </div>

            {(paletteType === 'analogous' || paletteType === 'monochromatic') && (
              <div className="form-group">
                <label htmlFor="count">Number of Colors:</label>
                <input
                  id="count"
                  type="number"
                  min="3"
                  max="10"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <div className="button-group">
              <button type="submit" disabled={loading || !baseColor}>
                {loading ? 'Generating...' : 'Generate Palette'}
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
        <div className="palette-result-section">
          <div className="tool-card">
            <h2>🎨 Generated Palette</h2>
            
            <div className="palette-info">
              <div className="info-item">
                <label>Base Color:</label>
                <span>{result.baseColor.hex}</span>
              </div>
              <div className="info-item">
                <label>Palette Type:</label>
                <span>{paletteTypes.find(t => t.value === result.paletteType)?.label}</span>
              </div>
              <div className="info-item">
                <label>Colors Count:</label>
                <span>{result.count}</span>
              </div>
            </div>

            <div className="color-palette">
              {result.palette.map((color, index) => (
                <div key={color.id} className="color-item">
                  <div 
                    className="color-swatch" 
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copyToClipboard(color.hex)}
                    title="Click to copy HEX"
                  />
                  <div className="color-details">
                    <div className="color-format">
                      <strong>HEX:</strong> 
                      <span onClick={() => copyToClipboard(color.hex)}>{color.hex}</span>
                    </div>
                    <div className="color-format">
                      <strong>RGB:</strong> 
                      <span onClick={() => copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`)}>
                        rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                      </span>
                    </div>
                    <div className="color-format">
                      <strong>HSL:</strong> 
                      <span onClick={() => copyToClipboard(color.css)}>{color.css}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="palette-actions">
              <button onClick={() => copyPalette('hex')} className="action-btn">
                📋 Copy HEX Values
              </button>
              <button onClick={() => copyPalette('rgb')} className="action-btn">
                📋 Copy RGB Values
              </button>
              <button onClick={() => copyPalette('hsl')} className="action-btn">
                📋 Copy HSL Values
              </button>
              <button onClick={() => copyPalette('css')} className="action-btn">
                📋 Copy CSS Variables
              </button>
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
