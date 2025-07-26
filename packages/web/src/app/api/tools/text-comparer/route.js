import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { text1, text2, compareType = 'lines' } = body;
    
    if (!text1 || !text2) {
      return NextResponse.json({ 
        success: false, 
        error: 'Both text inputs are required' 
      }, { status: 400 });
    }

    let result;
    
    switch (compareType) {
      case 'lines':
        result = compareLines(text1, text2);
        break;
      case 'words':
        result = compareWords(text1, text2);
        break;
      case 'characters':
        result = compareCharacters(text1, text2);
        break;
      default:
        result = compareLines(text1, text2);
    }

    return NextResponse.json({
      success: true,
      comparison: result,
      stats: {
        text1Length: text1.length,
        text2Length: text2.length,
        similarity: calculateSimilarity(text1, text2)
      }
    });

  } catch (error) {
    console.error('Text comparison error:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to compare texts. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

function compareLines(text1, text2) {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const maxLines = Math.max(lines1.length, lines2.length);
  
  const comparison = [];
  
  for (let i = 0; i < maxLines; i++) {
    const line1 = lines1[i] || '';
    const line2 = lines2[i] || '';
    
    comparison.push({
      lineNumber: i + 1,
      text1: line1,
      text2: line2,
      status: line1 === line2 ? 'equal' : line1 && line2 ? 'different' : line1 ? 'removed' : 'added'
    });
  }
  
  return comparison;
}

function compareWords(text1, text2) {
  const words1 = text1.split(/\s+/);
  const words2 = text2.split(/\s+/);
  
  // Simple word-by-word comparison
  const maxWords = Math.max(words1.length, words2.length);
  const comparison = [];
  
  for (let i = 0; i < maxWords; i++) {
    const word1 = words1[i] || '';
    const word2 = words2[i] || '';
    
    comparison.push({
      position: i + 1,
      word1: word1,
      word2: word2,
      status: word1 === word2 ? 'equal' : word1 && word2 ? 'different' : word1 ? 'removed' : 'added'
    });
  }
  
  return comparison;
}

function compareCharacters(text1, text2) {
  const maxLength = Math.max(text1.length, text2.length);
  const comparison = [];
  
  for (let i = 0; i < maxLength; i++) {
    const char1 = text1[i] || '';
    const char2 = text2[i] || '';
    
    comparison.push({
      position: i + 1,
      char1: char1,
      char2: char2,
      status: char1 === char2 ? 'equal' : char1 && char2 ? 'different' : char1 ? 'removed' : 'added'
    });
  }
  
  return comparison;
}

function calculateSimilarity(text1, text2) {
  const maxLength = Math.max(text1.length, text2.length);
  if (maxLength === 0) return 100;
  
  let matches = 0;
  const minLength = Math.min(text1.length, text2.length);
  
  for (let i = 0; i < minLength; i++) {
    if (text1[i] === text2[i]) {
      matches++;
    }
  }
  
  return Math.round((matches / maxLength) * 100);
}

// Handle GET requests for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Text Comparer API is running',
    methods: ['POST']
  });
}
