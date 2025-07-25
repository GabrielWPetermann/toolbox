# API Documentation

This document describes the REST API endpoints available in the Toolbox application.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://atoolbox.vercel.app/api`

## Architecture

The API is built using Next.js 14 App Router with serverless API routes. All endpoints are stateless and integrate with external services for reliability.

## Authentication

Currently, no authentication is required for the API endpoints.

## Content Type

All POST requests should include the header:
```
Content-Type: application/json
```

## Response Format

All API responses follow a consistent format:

```json
{
  "success": boolean,
  "data": object | null,
  "error": string | null,
  "message": string | null
}
```

## Endpoints

### URL Shortener

Shorten URLs using the TinyURL service for reliable, permanent short links.

**Endpoint**: `POST /tools/url-shortener`

**Request Body**:
```json
{
  "url": "https://example.com"
}
```

**Response** (Success):
```json
{
  "success": true,
  "data": {
    "originalUrl": "https://example.com",
    "shortUrl": "https://tinyurl.com/abc123",
    "provider": "tinyurl"
  }
}
```

**Response** (Error):
```json
{
  "success": false,
  "error": "Invalid URL format"
}
```

**Validation Rules**:
- `url`: Required, must be a valid URL format

**Features**:
- Uses TinyURL API for reliable shortening
- No custom codes (managed by TinyURL)
- Permanent links that don't expire
- Global redirect infrastructure
---

### QR Code Generator

Generate a QR code from text or URL.

**Endpoint**: `POST /tools/qr-code`

**Request Body**:
```json
{
  "text": "https://example.com or any text"
}
```

**Response** (Success):
```json
{
  "success": true,
  "data": {
    "text": "https://example.com",
    "qrCodeDataURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

**Response** (Error):
```json
{
  "success": false,
  "error": "Text is required"
}
```

**Validation Rules**:
- `text`: Required, any string

**Features**:
- Server-side QR code generation
- PNG format with base64 encoding
- High resolution for scanning
- Supports any text content

## Error Codes

| HTTP Status | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 500 | Internal Server Error |

## Rate Limiting

Currently, no rate limiting is implemented. The application relies on Vercel's built-in protections and TinyURL's rate limiting.

## Examples

### Curl Examples

**Shorten a URL**:
```bash
curl -X POST https://atoolbox.vercel.app/api/tools/url-shortener \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}'
```

**Generate a QR Code**:
```bash
curl -X POST https://atoolbox.vercel.app/api/tools/qr-code \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello World"}'
```

### JavaScript Examples

**Using fetch()**:
```javascript
// Shorten URL
const response = await fetch('/api/tools/url-shortener', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com'
  }),
});

const result = await response.json();
console.log(result.data.shortUrl); // TinyURL link
```

```javascript
// Generate QR Code
const response = await fetch('/api/tools/qr-code', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'https://example.com'
  }),
});

const result = await response.json();
// result.data.qrCodeDataURL contains the base64 image
```

## Notes

- **No Storage**: The application is stateless and doesn't store URLs
- **TinyURL Integration**: All shortened URLs are managed by TinyURL
- **Permanent Links**: TinyURL provides permanent, non-expiring links
- **Global Infrastructure**: TinyURL handles redirects worldwide
- **QR Codes**: Generated server-side and returned as base64 PNG images
- **Reliability**: External service integration ensures high availability
