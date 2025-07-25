import { Router, Request, Response } from 'express';
import QRCode from 'qrcode';
import shortid from 'shortid';

const router = Router();

// In-memory storage for URLs (later we can add a database)
const urlDatabase: { [key: string]: string } = {};

// URL Shortener
router.post('/url-shortener', async (req: Request, res: Response) => {
  try {
    const { url, customCode } = req.body;
    
    if (!url) {
      res.status(400).json({ 
        success: false, 
        error: 'URL is required' 
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid URL format' 
      });
      return;
    }

    let shortCode: string;

    if (customCode) {
      // Validate custom code
      if (!/^[a-zA-Z0-9\-_]{3,20}$/.test(customCode)) {
        res.status(400).json({
          success: false,
          error: 'Custom code must be 3-20 characters long and contain only letters, numbers, hyphens, and underscores'
        });
        return;
      }

      // Check if custom code already exists
      if (urlDatabase[customCode]) {
        res.status(400).json({
          success: false,
          error: 'This custom code is already taken. Please choose another one.'
        });
        return;
      }

      shortCode = customCode;
    } else {
      // Generate random code if no custom code provided
      shortCode = shortid.generate();
    }

    urlDatabase[shortCode] = url;

    // Get the base URL from environment or use default
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    res.json({
      success: true,
      data: {
        originalUrl: url,
        shortCode,
        shortUrl: `${baseUrl}/${shortCode}`,
        isCustom: !!customCode
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Redirect short URL
router.get('/s/:shortCode', (req: Request, res: Response) => {
  const { shortCode } = req.params;
  
  if (!shortCode) {
    res.status(400).json({ 
      success: false, 
      error: 'Short code is required' 
    });
    return;
  }

  const originalUrl = urlDatabase[shortCode];

  if (!originalUrl) {
    res.status(404).json({ 
      success: false, 
      error: 'Short URL not found' 
    });
    return;
  }

  res.redirect(originalUrl);
});

// QR Code generator
router.post('/qr-code', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      res.status(400).json({ 
        success: false, 
        error: 'Text is required' 
      });
      return;
    }

    const qrCodeDataURL = await QRCode.toDataURL(text);

    res.json({
      success: true,
      data: {
        text,
        qrCodeDataURL
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate QR code' 
    });
  }
});

// List all available tools
router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Available tools (MVP)',
    tools: [
      {
        name: 'url-shortener',
        endpoint: 'POST /api/tools/url-shortener',
        description: 'Shorten long URLs'
      },
      {
        name: 'qr-code',
        endpoint: 'POST /api/tools/qr-code', 
        description: 'Generate QR codes from text'
      }
    ],
  });
});

export { router as toolsRouter };
