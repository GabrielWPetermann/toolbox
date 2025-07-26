import { NextRequest, NextResponse } from 'next/server';

// Global storage for URLs - shared across all API routes
global.urlDatabase = global.urlDatabase || new Map();

export async function GET(request, { params }) {
  const { shortCode } = params;
  
  console.log(`Looking for shortCode: ${shortCode}`);
  console.log(`Available codes:`, Array.from(global.urlDatabase.keys()));
  
  if (!shortCode) {
    return NextResponse.json({ 
      success: false, 
      error: 'Short code is required' 
    }, { status: 400 });
  }

  const originalUrl = global.urlDatabase.get(shortCode);

  if (!originalUrl) {
    console.log(`Short code ${shortCode} not found in database`);
    return NextResponse.json({ 
      success: false, 
      error: 'Short URL not found' 
    }, { status: 404 });
  }

  console.log(`Redirecting ${shortCode} to ${originalUrl}`);
  // Return redirect response
  return NextResponse.redirect(originalUrl, 302);
}
