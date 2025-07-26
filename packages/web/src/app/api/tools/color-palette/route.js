import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { baseColor, paletteType = 'complementary', count = 5 } = body;
    
    if (!baseColor) {
      return NextResponse.json({ 
        success: false, 
        error: 'Base color is required' 
      }, { status: 400 });
    }

    // Convert any color format to HSL
    const hsl = convertToHSL(baseColor);
    if (!hsl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid color format' 
      }, { status: 400 });
    }

    let palette;
    
    switch (paletteType) {
      case 'complementary':
        palette = generateComplementary(hsl);
        break;
      case 'analogous':
        palette = generateAnalogous(hsl, count);
        break;
      case 'triadic':
        palette = generateTriadic(hsl);
        break;
      case 'monochromatic':
        palette = generateMonochromatic(hsl, count);
        break;
      case 'tetradic':
        palette = generateTetradic(hsl);
        break;
      default:
        palette = generateComplementary(hsl);
    }

    // Convert all colors to multiple formats
    const formattedPalette = palette.map((color, index) => ({
      id: index + 1,
      hsl: color,
      hex: hslToHex(color.h, color.s, color.l),
      rgb: hslToRgb(color.h, color.s, color.l),
      css: `hsl(${Math.round(color.h)}, ${Math.round(color.s)}%, ${Math.round(color.l)}%)`
    }));

    return NextResponse.json({
      success: true,
      baseColor: {
        hsl: hsl,
        hex: hslToHex(hsl.h, hsl.s, hsl.l),
        rgb: hslToRgb(hsl.h, hsl.s, hsl.l),
        css: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
      },
      palette: formattedPalette,
      paletteType: paletteType,
      count: formattedPalette.length
    });

  } catch (error) {
    console.error('Color palette generation error:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate color palette. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

function convertToHSL(color) {
  // Remove any whitespace
  color = color.trim();
  
  // Try to parse different color formats
  if (color.startsWith('#')) {
    return hexToHsl(color);
  } else if (color.startsWith('rgb')) {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return rgbToHsl(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
    }
  } else if (color.startsWith('hsl')) {
    const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (match) {
      return { h: parseInt(match[1]), s: parseInt(match[2]), l: parseInt(match[3]) };
    }
  }
  
  return null;
}

function hexToHsl(hex) {
  // Remove the hash if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  return rgbToHsl(r * 255, g * 255, b * 255);
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function hslToHex(h, s, l) {
  const rgb = hslToRgb(h, s, l);
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

function generateComplementary(baseHsl) {
  const complementaryH = (baseHsl.h + 180) % 360;
  return [
    baseHsl,
    { h: complementaryH, s: baseHsl.s, l: baseHsl.l }
  ];
}

function generateAnalogous(baseHsl, count) {
  const palette = [baseHsl];
  const step = 30; // 30 degrees apart
  
  for (let i = 1; i < count; i++) {
    const h = (baseHsl.h + (i * step)) % 360;
    palette.push({ h: h, s: baseHsl.s, l: baseHsl.l });
  }
  
  return palette;
}

function generateTriadic(baseHsl) {
  return [
    baseHsl,
    { h: (baseHsl.h + 120) % 360, s: baseHsl.s, l: baseHsl.l },
    { h: (baseHsl.h + 240) % 360, s: baseHsl.s, l: baseHsl.l }
  ];
}

function generateMonochromatic(baseHsl, count) {
  const palette = [];
  const lightnesStep = 80 / (count - 1); // Spread from 10% to 90% lightness
  
  for (let i = 0; i < count; i++) {
    const l = 10 + (i * lightnesStep);
    palette.push({ h: baseHsl.h, s: baseHsl.s, l: l });
  }
  
  return palette;
}

function generateTetradic(baseHsl) {
  return [
    baseHsl,
    { h: (baseHsl.h + 90) % 360, s: baseHsl.s, l: baseHsl.l },
    { h: (baseHsl.h + 180) % 360, s: baseHsl.s, l: baseHsl.l },
    { h: (baseHsl.h + 270) % 360, s: baseHsl.s, l: baseHsl.l }
  ];
}

// Handle GET requests for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Color Palette Generator API is running',
    methods: ['POST']
  });
}
