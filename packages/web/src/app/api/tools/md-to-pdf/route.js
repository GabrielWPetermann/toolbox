import { NextRequest, NextResponse } from 'next/server';
import { marked } from 'marked';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

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

    // Return PDF as base64
    const pdfBase64 = pdfBuffer.toString('base64');
    const pdfDataUrl = `data:application/pdf;base64,${pdfBase64}`;

    return NextResponse.json({
      success: true,
      data: {
        filename: `${filename}.pdf`,
        pdfDataUrl: pdfDataUrl,
        size: pdfBuffer.length
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    
    // More detailed error response
    let errorMessage = 'Failed to generate PDF';
    
    if (error.message.includes('Target closed')) {
      errorMessage = 'PDF generation interrupted. Please try again.';
    } else if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
      errorMessage = 'Browser connection error. Please try again.';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'PDF generation timeout. Please try again with shorter content.';
    } else if (error.message.includes('Protocol error')) {
      errorMessage = 'Browser protocol error. Please try again.';
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

async function generatePdf(htmlContent) {
  let browser = null;
  let page = null;
  
  try {
    // Detect if we're in production (Vercel) or development
    const isProduction = process.env.NODE_ENV === 'production';
    
    let launchOptions;
    
    if (isProduction) {
      // Production configuration using @sparticuz/chromium
      launchOptions = {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
        timeout: 60000
      };
    } else {
      // Development configuration using local Puppeteer
      launchOptions = {
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ],
        timeout: 60000
      };
    }
    
    console.log('Launching browser...', { isProduction });
    browser = await puppeteer.launch(launchOptions);
    
    page = await browser.newPage();
    
    // Configure page settings
    await page.setDefaultNavigationTimeout(60000);
    await page.setDefaultTimeout(60000);
    
    // Set content with simpler wait strategy
    await page.setContent(htmlContent, { 
      waitUntil: 'load',
      timeout: 60000
    });
    
    // Wait a bit for any dynamic content
    await page.waitForTimeout(2000);
    
    // Generate PDF with timeout
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
    // Ensure cleanup
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
