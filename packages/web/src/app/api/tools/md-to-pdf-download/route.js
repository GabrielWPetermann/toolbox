import { NextRequest, NextResponse } from 'next/server';
import { marked } from 'marked';
import puppeteer from 'puppeteer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { markdown, filename = 'document' } = body;
    
    if (!markdown) {
      return NextResponse.json({ 
        success: false, 
        error: 'Markdown content is required' 
      }, { status: 400 });
    }

    // Convert markdown to HTML
    const htmlContent = marked(markdown);
    
    // Create styled HTML document
    const styledHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${filename}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 2rem;
              color: #333;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #2c3e50;
              margin-top: 2rem;
              margin-bottom: 1rem;
            }
            h1 { font-size: 2.5em; border-bottom: 3px solid #3498db; padding-bottom: 0.5rem; }
            h2 { font-size: 2em; border-bottom: 2px solid #3498db; padding-bottom: 0.3rem; }
            h3 { font-size: 1.5em; color: #3498db; }
            p { margin-bottom: 1rem; text-align: justify; }
            code {
              background-color: #f8f9fa;
              padding: 0.2rem 0.4rem;
              border-radius: 3px;
              font-family: 'Courier New', monospace;
              color: #e83e8c;
            }
            pre {
              background-color: #f8f9fa;
              padding: 1rem;
              border-radius: 5px;
              overflow-x: auto;
              border-left: 4px solid #3498db;
            }
            pre code {
              background-color: transparent;
              padding: 0;
              color: #333;
            }
            blockquote {
              border-left: 4px solid #3498db;
              margin: 1rem 0;
              padding: 0.5rem 1rem;
              background-color: #f8f9fa;
              font-style: italic;
            }
            ul, ol {
              margin-bottom: 1rem;
              padding-left: 2rem;
            }
            li {
              margin-bottom: 0.5rem;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1rem;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 0.75rem;
              text-align: left;
            }
            th {
              background-color: #3498db;
              color: white;
              font-weight: bold;
            }
            a {
              color: #3498db;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 5px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .page-break {
              page-break-before: always;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    // Generate PDF with enhanced error handling
    const pdfBuffer = await generatePdf(styledHtml);

    // Return PDF as file download
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate PDF',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

async function generatePdf(htmlContent) {
  let browser = null;
  let page = null;
  
  try {
    // Enhanced Puppeteer configuration for production
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--run-all-compositor-stages-before-draw',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows',
        '--disable-ipc-flooding-protection'
      ],
      timeout: 60000,
      protocolTimeout: 60000
    });
    
    page = await browser.newPage();
    
    // Configure page settings
    await page.setDefaultNavigationTimeout(60000);
    await page.setDefaultTimeout(60000);
    
    // Set content
    await page.setContent(htmlContent, { 
      waitUntil: 'load',
      timeout: 60000
    });
    
    // Wait for content to render
    await page.waitForTimeout(2000);
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      },
      printBackground: true,
      timeout: 60000
    });
    
    return pdfBuffer;
  } finally {
    // Cleanup
    if (page) {
      try {
        await page.close();
      } catch (e) {
        console.warn('Error closing page:', e.message);
      }
    }
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.warn('Error closing browser:', e.message);
      }
    }
  }
}
