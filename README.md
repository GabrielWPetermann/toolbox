# 🧰 Toolbox Web

A modern, comprehensive web toolbox built with TypeScript, Node.js, and React. This application provides a collection of practical tools for developers and everyday users, featuring URL shortening, QR code generation, and more utilities in a clean, responsive interface.

🔗 **Live Demo**: [atoolbox.vercel.app](https://atoolbox.vercel.app)

[![Deployment Status](https://img.shields.io/badge/deployment-vercel-black?logo=vercel)](https://atoolbox.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)

## ✨ Features

### 🔗 URL Shortener
- **Custom Short Codes**: Create personalized short links like `atoolbox.vercel.app/my-link`
- **Auto-Generated Codes**: Automatic short code generation if no custom code is provided
- **Real-time Validation**: Instant feedback on code availability and format
- **Copy to Clipboard**: One-click copying functionality
- **Redirect Tracking**: Seamless redirection to original URLs

### 📱 QR Code Generator  
- **Instant Generation**: Create QR codes from any text or URL
- **High Quality**: PNG format with optimal resolution
- **Download Support**: Save QR codes directly to device
- **Live Preview**: Real-time QR code preview
- **Versatile Input**: Works with URLs, text, contact info, WiFi credentials

### 🎨 Modern Interface
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Glass Morphism**: Modern UI with backdrop blur effects
- **Real-time Status**: Live connection status indicator
- **Loading States**: Smooth loading animations and feedback
- **Error Handling**: User-friendly error messages and validation

### 📱 PWA Ready
- **Installable**: Can be installed as a native app on any device
- **Offline Interface**: Core UI works without internet connection
- **Custom Branding**: Custom toolbox icon and theme
- **App-like Experience**: Native app feel with web technology

## 🛠 Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety and IntelliSense
- **Custom CSS**: Modern styling with CSS Grid and Flexbox
- **PWA Support**: Service worker and manifest configuration

### Backend
- **Express.js**: Fast, unopinionated web framework
- **Node.js**: JavaScript runtime built on Chrome's V8 engine
- **TypeScript**: Type-safe server-side development
- **CORS**: Cross-origin resource sharing configuration
- **RESTful API**: Clean, consistent API design

### Development & Deployment
- **Vercel**: Zero-configuration deployment platform
- **npm Workspaces**: Monorepo management
- **ESLint**: Code linting and formatting
- **Hot Reload**: Instant development feedback

## � Project Structure

```
toolbox/
├── packages/
│   ├── web/                    # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/           # App Router pages
│   │   │   │   ├── [code]/    # Dynamic route for short URLs
│   │   │   │   ├── layout.tsx # Root layout with PWA config
│   │   │   │   └── page.tsx   # Homepage
│   │   │   └── components/    # React components
│   │   │       ├── UrlShortener.tsx
│   │   │       ├── QRCodeGenerator.tsx
│   │   │       └── StatusIndicator.tsx
│   │   ├── public/           # Static assets
│   │   └── package.json
│   └── api/                  # Express.js Backend
│       ├── src/
│       │   ├── routes/       # API route handlers
│       │   │   └── tools.ts  # Main tools endpoints
│       │   └── index.ts      # Server configuration
│       └── package.json
├── docs/                     # Documentation
│   ├── API.md               # API documentation
│   └── DEPLOYMENT.md        # Deployment guide
├── vercel.json              # Vercel configuration
├── package.json             # Root package.json
└── README.md               # This file
```

## � Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- Git

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/your-username/toolbox.git
cd toolbox
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development servers**:
```bash
npm run dev
```

This starts both frontend (http://localhost:3000) and backend (http://localhost:3001) concurrently.

### Development Commands

```bash
# Start both frontend and backend
npm run dev

# Start only frontend
npm run dev:web

# Start only backend  
npm run dev:api

# Build for production
npm run build

# Start production server
npm start
```

## 📖 Documentation

- **[API Documentation](docs/API.md)** - Complete API reference with examples
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Step-by-step deployment instructions

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/tools/url-shortener` | POST | Create short URL |
| `/api/tools/s/:code` | GET | Redirect to original URL |
| `/api/tools/qr-code` | POST | Generate QR code |
| `/api/tools/` | GET | List available tools |

### Example API Usage

**Shorten a URL**:
```bash
curl -X POST https://atoolbox.vercel.app/api/tools/url-shortener \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com", "customCode": "github"}'
```

**Generate QR Code**:
```bash
curl -X POST https://atoolbox.vercel.app/api/tools/qr-code \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello World"}'
```

## 🌐 Deployment

The application is configured for seamless deployment on Vercel:

1. **Connect GitHub repository** to Vercel
2. **Configure environment variables**:
   - `NEXT_PUBLIC_API_URL=https://atoolbox.vercel.app/api`
   - `FRONTEND_URL=https://atoolbox.vercel.app`
3. **Deploy automatically** on every push to main branch

See the [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

## 🔧 Configuration

### Environment Variables

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Backend** (`.env`):
```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
PORT=3001
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔄 Roadmap

- [ ] **Database Integration**: Replace in-memory storage with PostgreSQL
- [ ] **User Accounts**: User registration and URL management
- [ ] **Analytics**: Click tracking and statistics
- [ ] **Custom Domains**: Support for custom short domains
- [ ] **Bulk Operations**: Batch URL shortening and QR generation
- [ ] **API Authentication**: JWT-based API authentication
- [ ] **Rate Limiting**: Request rate limiting and abuse prevention
- [ ] **More Tools**: Text utilities, image tools, converters

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For the seamless deployment platform
- **QRCode.js** - For QR code generation
- **Express.js** - For the lightweight backend framework

---

Built using modern web technologies. Perfect for developers who need quick access to essential tools without leaving their browser.
