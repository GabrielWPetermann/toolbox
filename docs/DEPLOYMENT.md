# Deployment Guide

This guide explains how to deploy the Toolbox application to Vercel.

## Architecture

The application consists of two main parts:
- **Frontend**: Next.js application (`packages/web`)
- **Backend**: Express.js API (`packages/api`)

Both are deployed as a single Vercel project using the monorepo configuration.

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
**Build Command**: 
```bash
cd ../.. && npm run build
```
**Output Directory**: `packages/web/.next`
**Install Command**: 
```bash
npm install
```

### 3. Environment Variables

Add these environment variables in Vercel dashboard:

#### Production Environment Variables:
```
NEXT_PUBLIC_API_URL=https://atoolbox.vercel.app/api
FRONTEND_URL=https://atoolbox.vercel.app
NODE_ENV=production
```

#### For Custom Domain:
If you're using a custom domain, update the URLs:
```
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
FRONTEND_URL=https://yourdomain.com
```

### 4. Vercel Configuration

The project includes a `vercel.json` file with the following configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "packages/web/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "packages/api/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "packages/api/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "packages/web/$1"
    }
  ]
}
```

This configuration:
- Builds both frontend and backend
- Routes `/api/*` requests to the Express API
- Routes all other requests to the Next.js frontend

### 5. Deploy

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
