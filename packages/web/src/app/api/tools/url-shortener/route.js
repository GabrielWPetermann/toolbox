import { NextRequest, NextResponse } from 'next/server';

// Global storage for URLs - shared across all API routes
global.urlDatabase = global.urlDatabase || new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;
    
    if (!url) {
      return NextResponse.json({ 
        success: false, 
        error: 'URL is required' 
      }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid URL format' 
      }, { status: 400 });
    }

    // Use TinyURL API for automatic short URLs
    try {
      const tinyUrlResponse = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      
      if (!tinyUrlResponse.ok) {
        throw new Error('TinyURL API failed');
      }
      
      const shortUrl = await tinyUrlResponse.text();
      
      // Validate the response
      if (!shortUrl || shortUrl.includes('Error') || !shortUrl.startsWith('http')) {
        throw new Error('Invalid response from TinyURL');
      }

      return NextResponse.json({
        success: true,
        data: {
          originalUrl: url,
          shortUrl: shortUrl,
          provider: 'tinyurl'
        }
      });
      
    } catch (error) {
      console.error('TinyURL failed:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to shorten URL. Please try again later.' 
      }, { status: 500 });
    }
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
