import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for URLs (shared with url-shortener)
const urlDatabase = new Map();

export async function GET(request, { params }) {
  const { shortCode } = params;
  
  if (!shortCode) {
    return NextResponse.json({ 
      success: false, 
      error: 'Short code is required' 
    }, { status: 400 });
  }

  const originalUrl = urlDatabase.get(shortCode);

  if (!originalUrl) {
    return NextResponse.json({ 
      success: false, 
      error: 'Short URL not found' 
    }, { status: 404 });
  }

  // Return redirect response
  return NextResponse.redirect(originalUrl, 302);
}
