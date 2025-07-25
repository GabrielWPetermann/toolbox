import { NextRequest, NextResponse } from 'next/server';

// Global storage for URLs - shared across all API routes
global.urlDatabase = global.urlDatabase || new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { url, customCode } = body;
    
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

    let shortCode;

    if (customCode) {
      // Validate custom code
      if (!/^[a-zA-Z0-9\-_]{3,20}$/.test(customCode)) {
        return NextResponse.json({
          success: false,
          error: 'Custom code must be 3-20 characters long and contain only letters, numbers, hyphens, and underscores'
        }, { status: 400 });
      }

      // Check if custom code already exists
      if (global.urlDatabase.has(customCode)) {
        return NextResponse.json({
          success: false,
          error: 'This custom code is already taken. Please choose another one.'
        }, { status: 400 });
      }

      shortCode = customCode;
    } else {
      // Generate random code if no custom code provided
      shortCode = Math.random().toString(36).substring(2, 8);
    }

    global.urlDatabase.set(shortCode, url);

    // Get the base URL from environment or request
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    return NextResponse.json({
      success: true,
      data: {
        originalUrl: url,
        shortCode,
        shortUrl: `${baseUrl}/${shortCode}`,
        isCustom: !!customCode
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
