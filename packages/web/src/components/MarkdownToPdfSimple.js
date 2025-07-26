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
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (pdfResult?.htmlContent) {
      const printWindow = window.open('', '_blank');
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${pdfResult.filename}</title>
          <style>
            @media print {
              @page { margin: 1in; }
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              h1, h2, h3, h4, h5, h6 { break-after: avoid; }
              pre { white-space: pre-wrap; break-inside: avoid; }
              img { max-width: 100%; height: auto; }
            }
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
            h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
            pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
            code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
            blockquote { border-left: 4px solid #ccc; margin: 0; padding-left: 16px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>${pdfResult.htmlContent}</body>
        </html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }
  };

  const copyPdfToClipboard = async () => {
    if (pdfResult?.htmlContent) {
      try {
        await navigator.clipboard.writeText(pdfResult.htmlContent);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } catch (error) {
        console.error('Failed to copy HTML to clipboard:', error);
      }
    }
  };

  return (
    <div className="md-to-pdf-container">
      <div className="md-input-section">
        <form onSubmit={handleSubmit} className="pdf-form">
          <div className="form-group">
            <label htmlFor="filename">Filename:</label>
            <input
              type="text"
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="document"
              className="filename-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="markdown">Markdown Content:</label>
            <textarea
              id="markdown"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Enter your Markdown content here..."
              className="markdown-input"
              rows={15}
            />
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              disabled={loading || !markdown.trim()}
              className="action-btn primary"
            >
              {loading ? '🔄 Converting...' : '🔄 Convert to HTML'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      <div className="pdf-preview-section">
        <h3>📄 Preview & Actions</h3>
        
        {pdfResult ? (
          <>
            <div className="pdf-info">
              <p><strong>File:</strong> {pdfResult.filename}</p>
              <p><strong>Generated:</strong> {new Date().toLocaleString()}</p>
            </div>

            <div className="pdf-actions">
              <button onClick={downloadPdf} className="action-btn">
                🖨️ Print as PDF
              </button>
              <button onClick={copyPdfToClipboard} className="action-btn">
                📄 Copy HTML
              </button>
            </div>

            <div className="preview-container">
              <iframe
                srcDoc={pdfResult.htmlContent}
                title="PDF Preview"
                className="pdf-preview"
                sandbox="allow-same-origin"
              />
            </div>
          </>
        ) : (
          <div className="preview-placeholder">
            <p>📝 Enter Markdown content and click "Convert to HTML" to see the preview</p>
          </div>
        )}
      </div>

      <CopyNotification show={showNotification} />
    </div>
  );
}
