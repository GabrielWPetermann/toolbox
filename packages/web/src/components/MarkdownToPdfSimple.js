'use client';

import { useState } from 'react';
import CopyNotification from './CopyNotification';

export default function MarkdownToPdfSimple() {
  const [markdown, setMarkdown] = useState('');
  const [filename, setFilename] = useState('document');
  const [pdfResult, setPdfResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!markdown.trim()) return;

    setLoading(true);
    setError('');
    setPdfResult(null);

    try {
      const response = await fetch('/api/tools/md-to-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          markdown: markdown.trim(),
          filename: filename.trim() || 'document'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPdfResult(data.data);
        console.log('PDF generated successfully:', data.data.filename);
      } else {
        console.error('PDF generation failed:', data.error, data.details);
        setError(data.error || 'Failed to generate PDF');
        if (data.details) {
          console.error('Error details:', data.details);
        }
      }
    } catch (err) {
      console.error('Network/request error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfResult) return;
    
    // If we have HTML content, open it in a new window for printing
    if (pdfResult.html) {
      const newWindow = window.open('', '_blank');
      newWindow.document.write(pdfResult.html);
      newWindow.document.close();
      
      // Wait for content to load then trigger print dialog
      setTimeout(() => {
        newWindow.print();
      }, 500);
    } else if (pdfResult.pdfDataUrl) {
      // Fallback to original PDF download method
      const link = document.createElement('a');
      link.download = pdfResult.filename;
      link.href = pdfResult.pdfDataUrl;
      link.click();
    }
  };

  const downloadPdfDirect = async () => {
    if (!markdown.trim()) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tools/md-to-pdf-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          markdown: markdown.trim(),
          filename: filename.trim() || 'document'
        }),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('text/html')) {
          // HTML response - open in new tab for printing
          const htmlContent = await response.text();
          const newWindow = window.open('', '_blank');
          newWindow.document.write(htmlContent);
          newWindow.document.close();
          
          setShowNotification(true);
        } else {
          // PDF response - download as file
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename || 'document'}.pdf`;
          link.click();
          URL.revokeObjectURL(url);
          
          setShowNotification(true);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate document');
      }
    } catch (err) {
      console.error('Direct download error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyPdfToClipboard = async () => {
    if (!pdfResult) return;
    
    try {
      // If we have HTML content, copy the HTML
      if (pdfResult.html) {
        await navigator.clipboard.writeText(pdfResult.html);
        setShowNotification(true);
        return;
      }
      
      // Fallback to original PDF method
      const response = await fetch(pdfResult.pdfDataUrl);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({ 'application/pdf': blob })
      ]);
      
      setShowNotification(true);
    } catch (err) {
      // Fallback: copy the data URL or HTML
      try {
        const contentToCopy = pdfResult.html || pdfResult.pdfDataUrl;
        await navigator.clipboard.writeText(contentToCopy);
        setShowNotification(true);
      } catch (fallbackErr) {
        console.error('Failed to copy content:', fallbackErr);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const sampleMarkdown = `# Sample Document

## Introduction
This is a **sample** Markdown document to demonstrate the *MD to PDF* converter.

### Features
- Convert Markdown to styled PDF
- Professional formatting
- Code syntax highlighting
- Tables and lists support

### Code Example
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Table Example
| Feature | Status |
|---------|--------|
| Headers | ✅ |
| Lists | ✅ |
| Code | ✅ |
| Tables | ✅ |

> This is a blockquote example

For more information, visit [GitHub](https://github.com).`;

  return (
    <div className="md-to-pdf-container">
      <div className="md-input-section">
        <div className="tool-card">
          <h2>📝 Create Document</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="filename">Filename (without extension):</label>
              <input
                id="filename"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="document"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="markdown">Markdown Content:</label>
              <div className="textarea-with-sample">
                <textarea
                  id="markdown"
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="Enter your Markdown content here..."
                  rows={12}
                  required
                  disabled={loading}
                />
                <button 
                  type="button" 
                  onClick={() => setMarkdown(sampleMarkdown)}
                  className="sample-btn"
                  disabled={loading}
                >
                  📝 Load Sample
                </button>
              </div>
            </div>

            <div className="button-group">
              <button type="submit" disabled={loading || !markdown.trim()}>
                {loading ? 'Generating PDF...' : 'Generate PDF'}
              </button>
              
              <button 
                type="button" 
                onClick={downloadPdfDirect}
                disabled={loading || !markdown.trim()}
                className="action-btn"
              >
                �️ Quick Print
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

      {pdfResult && (
        <div className="pdf-preview-section">
          <div className="tool-card">
            <h2>📄 Document Preview</h2>
            
            <div className="pdf-info">
              <div className="result-item">
                <label>Filename:</label>
                <span>{pdfResult.filename}</span>
              </div>
              <div className="result-item">
                <label>File Size:</label>
                <span>{formatFileSize(pdfResult.size)}</span>
              </div>
            </div>

            {/* Preview iframe */}
            {pdfResult.html && (
              <div className="pdf-preview-frame">
                <h3>📖 Preview</h3>
                <iframe
                  srcDoc={pdfResult.html}
                  style={{
                    width: '100%',
                    height: '600px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: 'white'
                  }}
                  title="Document Preview"
                />
              </div>
            )}

            <div className="pdf-actions">
              <button onClick={downloadPdf} className="action-btn">
                �️ Print as PDF
              </button>
              <button onClick={copyPdfToClipboard} className="action-btn">
                📋 Copy HTML
              </button>
            </div>

            <div className="pdf-preview-message">
              <p>✅ Document formatted successfully!</p>
              <p>Click "Print as PDF" to open in a new window where you can save as PDF using your browser's print function (Ctrl+P → Save as PDF).</p>
            </div>
          </div>
        </div>
      )}

      <CopyNotification 
        show={showNotification} 
        onHide={() => setShowNotification(false)} 
        message="PDF criado com sucesso!"
      />
    </div>
  );
}
