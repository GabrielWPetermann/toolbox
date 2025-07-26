import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { jsonText } = body;
    
    if (!jsonText) {
      return NextResponse.json({ 
        success: false, 
        error: 'JSON text is required' 
      }, { status: 400 });
    }

    try {
      // Try to parse the JSON
      const parsed = JSON.parse(jsonText);
      
      // Calculate some stats
      const stats = {
        type: Array.isArray(parsed) ? 'array' : typeof parsed,
        size: JSON.stringify(parsed).length,
        keys: typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 0,
        levels: calculateDepth(parsed)
      };

      return NextResponse.json({
        success: true,
        valid: true,
        parsed: parsed,
        stats: stats,
        formatted: JSON.stringify(parsed, null, 2)
      });

    } catch (parseError) {
      // Extract error details
      const errorMatch = parseError.message.match(/position (\d+)/);
      const position = errorMatch ? parseInt(errorMatch[1]) : null;
      
      let line = 1;
      let column = 1;
      
      if (position !== null) {
        const beforeError = jsonText.substring(0, position);
        line = (beforeError.match(/\n/g) || []).length + 1;
        column = position - (beforeError.lastIndexOf('\n') || -1);
      }

      return NextResponse.json({
        success: true,
        valid: false,
        error: parseError.message,
        position: position,
        line: line,
        column: column
      });
    }

  } catch (error) {
    console.error('JSON validation error:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to validate JSON. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

function calculateDepth(obj, depth = 0) {
  if (typeof obj !== 'object' || obj === null) {
    return depth;
  }
  
  let maxDepth = depth;
  for (const value of Object.values(obj)) {
    maxDepth = Math.max(maxDepth, calculateDepth(value, depth + 1));
  }
  
  return maxDepth;
}

// Handle GET requests for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'JSON Validator API is running',
    methods: ['POST']
  });
}
