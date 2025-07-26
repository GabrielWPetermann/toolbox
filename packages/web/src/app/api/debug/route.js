import { NextResponse } from 'next/server';

// Global storage for URLs - shared across all API routes
global.urlDatabase = global.urlDatabase || new Map();

export async function GET() {
  const urls = Array.from(global.urlDatabase.entries()).map(([code, url]) => ({
    shortCode: code,
    originalUrl: url
  }));

  return NextResponse.json({
    success: true,
    totalUrls: urls.length,
    urls: urls
  });
}
