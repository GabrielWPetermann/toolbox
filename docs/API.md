# API Documentation

This document describes the REST API endpoints available in the Toolbox application.

## Base URL

- **Development**: `http://localhost:3001/api`
- **Production**: `https://atoolbox.vercel.app/api`

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

### Health Check

Check if the API is running.

**Endpoint**: `GET /health`

**Response**:
```json
{
  "success": true,
  "message": "API is running"
}
```

---

### URL Shortener

Create a shortened URL with optional custom code.

**Endpoint**: `POST /tools/url-shortener`

**Request Body**:
```json
{
  "url": "https://example.com",
  "customCode": "my-custom-code" // optional
}
```

**Response** (Success):
```json
{
  "success": true,
  "data": {
    "originalUrl": "https://example.com",
    "shortCode": "my-custom-code",
    "shortUrl": "https://atoolbox.vercel.app/my-custom-code",
    "isCustom": true
  }
}
```

**Response** (Error):
```json
{
  "success": false,
  "error": "Custom code must be 3-20 characters long and contain only letters, numbers, hyphens, and underscores"
}
```

**Validation Rules**:
- `url`: Required, must be a valid URL
- `customCode`: Optional, 3-20 characters, alphanumeric + hyphens + underscores only

---

### URL Redirect

Redirect a short code to its original URL.

**Endpoint**: `GET /tools/s/:shortCode`

**Parameters**:
- `shortCode`: The short code to redirect

**Response** (Success):
- HTTP 302 redirect to the original URL

**Response** (Error):
```json
{
  "success": false,
  "error": "Short URL not found"
}
```

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

---

### List Available Tools

Get information about all available tools.

**Endpoint**: `GET /tools/`

**Response**:
```json
{
  "success": true,
  "message": "Available tools (MVP)",
  "tools": [
    {
      "name": "url-shortener",
      "endpoint": "POST /api/tools/url-shortener",
      "description": "Shorten long URLs"
    },
    {
      "name": "qr-code",
      "endpoint": "POST /api/tools/qr-code",
      "description": "Generate QR codes from text"
    }
  ]
}
```

## Error Codes

| HTTP Status | Description |
|-------------|-------------|
| 200 | Success |
| 302 | Redirect (for short URLs) |
| 400 | Bad Request (validation error) |
| 404 | Not Found (short code doesn't exist) |
| 500 | Internal Server Error |

## Rate Limiting

Currently, no rate limiting is implemented. This may be added in future versions.

## Examples

### Curl Examples

**Create a short URL**:
```bash
curl -X POST https://atoolbox.vercel.app/api/tools/url-shortener \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com", "customCode": "github"}'
```

**Generate a QR Code**:
```bash
curl -X POST https://atoolbox.vercel.app/api/tools/qr-code \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello World"}'
```

**Check API Health**:
```bash
curl https://atoolbox.vercel.app/api/health
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
    url: 'https://example.com',
    customCode: 'example'
  }),
});

const result = await response.json();
console.log(result.data.shortUrl);
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

- All URLs are stored in memory and will be lost when the server restarts
- In production, consider implementing persistent storage (database)
- Short codes are case-sensitive
- The QR code is returned as a base64-encoded PNG image
- Custom codes must be unique across the entire system
