# Deployment Guide

This guide explains how to deploy the Toolbox application to Vercel as a full-stack Next.js application.

## Architecture

The application is a **single Next.js 14 project** with:
- **Frontend**: React components with glassmorphism design
- **API Routes**: Next.js API routes handling URL shortening and QR generation
- **External Services**: TinyURL integration for reliable URL shortening

## Prerequisites

1. GitHub repository with the code
2. Vercel account
3. Domain configured (optional)

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Choose the repository: `your-username/toolbox`

### 2. Configure Project Settings

**Framework Preset**: Next.js
**Root Directory**: `packages/web`
**Build Command**: `npm run build`
**Output Directory**: `.next`
**Install Command**: `npm install`

### 3. Environment Variables (Optional)

No environment variables are required for basic functionality:

```
NODE_ENV=production
```

### 4. Deploy

1. **Push to GitHub**: Commit and push your changes
2. **Automatic Deploy**: Vercel will automatically deploy when you push to main branch
3. **Check Build Logs**: Monitor the deployment in Vercel dashboard

## Domain Configuration

### Default Vercel Domain
Your app will be available at:
- Primary: `https://your-project-name.vercel.app`
- API: `https://your-project-name.vercel.app/api`

### Custom Domain (Optional)

1. Go to Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Build Process

The project uses standard Next.js build process:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## Post-Deployment Checklist

- ✅ Frontend loads with glassmorphism design
- ✅ URL shortener connects to TinyURL
- ✅ QR code generator works
- ✅ Mobile responsive design
- ✅ API routes respond correctly
- ✅ Glass effects render properly
- ✅ Gradient animations work

## Troubleshooting

### Common Issues

**Build Fails**:
- Check for JavaScript syntax errors in build logs
- Verify all dependencies are installed in package.json
- Ensure imports/exports are correct

**API Not Responding**:
- Check API route files are in correct location (`src/app/api/`)
- Verify route.js files export correct HTTP methods
- Check browser network tab for API errors

**TinyURL Integration Issues**:
- Verify internet connectivity from Vercel
- Check TinyURL service status
- Ensure URL validation is working

**Styling Issues**:
- Check if CSS files are imported correctly
- Verify backdrop-filter support in target browsers
- Test glassmorphism effects on different devices

### Debug Commands

Test API endpoints after deployment:

```bash
# Test URL shortener
curl -X POST https://atoolbox.vercel.app/api/tools/url-shortener \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}'

# Test QR code generator
curl -X POST https://atoolbox.vercel.app/api/tools/qr-code \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello World"}'
```

## Performance Optimization

- **Static Assets**: Automatically optimized by Vercel
- **API Routes**: Serverless functions with fast cold starts
- **TinyURL Caching**: External service handles caching
- **CSS Optimization**: Next.js optimizes CSS automatically
- **CDN**: Vercel provides global CDN automatically

## Security Considerations

- **Input Validation**: URL validation implemented
- **External APIs**: TinyURL handles security
- **HTTPS**: Enforced by Vercel
- **No Storage**: Stateless application, no data persistence

## Monitoring

Vercel provides:
- **Analytics**: Page views and performance metrics
- **Function Logs**: API route execution logs  
- **Error Tracking**: Runtime errors and debugging
- **Performance Metrics**: Core Web Vitals and loading times

---

The deployment is designed to be simple and automatic. Push to GitHub, and Vercel handles the rest! The glassmorphism design works perfectly in production with full browser support.

## Domain Configuration

### Default Vercel Domain
Your app will be available at:
- Primary: `https://your-project-name.vercel.app`
- API: `https://your-project-name.vercel.app/api`

### Custom Domain (Optional)

1. Go to Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update environment variables with new domain

## Build Scripts

The project uses these npm scripts:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:api\" \"npm run dev:web\"",
    "dev:api": "npm run dev --workspace=packages/api",
    "dev:web": "npm run dev --workspace=packages/web",
    "build": "npm run build --workspace=packages/api && npm run build --workspace=packages/web",
    "start": "npm run start --workspace=packages/web"
  }
}
```

## Post-Deployment Checklist

- ✅ Frontend loads correctly
- ✅ API endpoints respond
- ✅ URL shortener works
- ✅ QR code generator works
- ✅ Short URL redirects work
- ✅ PWA manifest loads
- ✅ Favicon displays
- ✅ Mobile responsive
- ✅ CORS configured properly

## Troubleshooting

### Common Issues

**Build Fails**:
- Check TypeScript errors in build logs
- Verify all dependencies are installed
- Check environment variables are set

**API Not Responding**:
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS configuration
- Ensure Express routes are properly configured

**Short URLs Don't Work**:
- Verify `FRONTEND_URL` environment variable
- Check the redirect route is working
- Ensure the API route `/api/tools/s/:code` returns proper redirects

**Environment Variables Not Working**:
- Prefix client-side vars with `NEXT_PUBLIC_`
- Redeploy after changing environment variables
- Check variable names match exactly

### Debug Commands

Test API endpoints after deployment:

```bash
# Health check
curl https://atoolbox.vercel.app/api/health

# Create short URL
curl -X POST https://atoolbox.vercel.app/api/tools/url-shortener \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com", "customCode": "test"}'

# Test redirect
curl -I https://atoolbox.vercel.app/test
```

## Performance Optimization

- **Static Assets**: Automatically optimized by Vercel
- **API Caching**: Consider adding Redis for production
- **Database**: Currently using in-memory storage
- **CDN**: Vercel provides global CDN automatically

## Security Considerations

- **CORS**: Configured for frontend domain only
- **Rate Limiting**: Not implemented (consider adding)
- **Input Validation**: Implemented for URL and custom codes
- **HTTPS**: Enforced by Vercel

## Monitoring

Vercel provides:
- **Analytics**: Page views and performance
- **Function Logs**: API request logs
- **Error Tracking**: Runtime errors
- **Performance Metrics**: Core Web Vitals

## Scaling

For high traffic:
- **Database**: Replace in-memory storage with PostgreSQL/MongoDB
- **Caching**: Add Redis for URL lookups
- **Rate Limiting**: Implement API rate limiting
- **CDN**: Already provided by Vercel

---

The deployment is designed to be simple and automatic. Push to GitHub, and Vercel handles the rest!
