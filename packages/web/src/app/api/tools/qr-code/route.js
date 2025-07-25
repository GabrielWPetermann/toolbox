import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function POST(request) {
  try {
    const body = await request.json();
    const { text } = body;
    
    if (!text) {
      return NextResponse.json({ 
        success: false, 
        error: 'Text is required' 
      }, { status: 400 });
    }

    const qrCodeDataURL = await QRCode.toDataURL(text);

    return NextResponse.json({
      success: true,
      data: {
        text,
        qrCodeDataURL
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate QR code' 
    }, { status: 500 });
  }
}
