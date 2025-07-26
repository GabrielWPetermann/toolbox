'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import CopyNotification from './CopyNotification';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
}

export default function MarkdownToPdf() {
  const [markdown, setMarkdown] = useState('');
  const [filename, setFilename] = useState('document');
  const [pdfResult, setPdfResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

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
        setPageNumber(1); // Reset to first page
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
    
    const link = document.createElement('a');
    link.download = pdfResult.filename;
    link.href = pdfResult.pdfDataUrl;
    link.click();
  };

  const copyPdfToClipboard = async () => {
    if (!pdfResult) return;
    
    try {
      // Convert base64 to blob
      const response = await fetch(pdfResult.pdfDataUrl);
      const blob = await response.blob();
      
      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ 'application/pdf': blob })
      ]);
      
      setShowNotification(true);
    } catch (err) {
      // Fallback: copy the download URL
      try {
        await navigator.clipboard.writeText(pdfResult.pdfDataUrl);
        setShowNotification(true);
      } catch (fallbackErr) {
        console.error('Failed to copy PDF:', fallbackErr);
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

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
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

            <button type="submit" disabled={loading || !markdown.trim()}>
              {loading ? 'Generating PDF...' : 'Generate PDF'}
            </button>
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
            <h2>📄 PDF Preview</h2>
            
            <div className="pdf-info">
              <div className="result-item">
                <label>Filename:</label>
                <span>{pdfResult.filename}</span>
              </div>
              <div className="result-item">
                <label>File Size:</label>
                <span>{formatFileSize(pdfResult.size)}</span>
              </div>
              {numPages && (
                <div className="result-item">
                  <label>Pages:</label>
                  <span>{numPages}</span>
                </div>
              )}
            </div>

            <div className="pdf-actions">
              <button onClick={downloadPdf} className="action-btn">
                📥 Download PDF
              </button>
              <button onClick={copyPdfToClipboard} className="action-btn">
                📋 Copy PDF
              </button>
            </div>

            <div className="pdf-preview">
              <Document
                file={pdfResult.pdfDataUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) => {
                  console.error('PDF load error:', error);
                  setError(`Preview error: ${error.message || 'Failed to load PDF preview'}`);
                }}
                loading={<div className="pdf-loading">Loading PDF preview...</div>}
                error={<div className="pdf-error">Failed to load PDF preview. You can still download the file.</div>}
              >
                <Page 
                  pageNumber={pageNumber} 
                  width={typeof window !== 'undefined' ? Math.min(400, window.innerWidth - 100) : 400}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
              
              {numPages && numPages > 1 && (
                <div className="pdf-navigation">
                  <button 
                    onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                    disabled={pageNumber <= 1}
                    className="action-btn"
                  >
                    ← Previous
                  </button>
                  <span className="page-info">
                    Page {pageNumber} of {numPages}
                  </span>
                  <button 
                    onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                    disabled={pageNumber >= numPages}
                    className="action-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <CopyNotification 
        show={showNotification} 
        onHide={() => setShowNotification(false)} 
        message="PDF copiado para área de transferência!"
      />
    </div>
  );
}
