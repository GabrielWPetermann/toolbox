# 🧰 Toolbox - Essential Developer Tools

A modern web application that provides essential developer tools including URL shortening and QR code generation. Built with Next.js 14 and features a stunning glassmorphism design with TinyURL integration for reliable URL shortening.

🔗 **Live Demo**: [atoolbox.vercel.app](https://atoolbox.vercel.app)

[![Deployment Status](https://img.shields.io/badge/deployment-vercel-black?logo=vercel)](https://atoolbox.vercel.app)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TinyURL](https://img.shields.io/badge/TinyURL-API-blue)](https://tinyurl.com/)

## ✨ Features

### 🔗 URL Shortener
- **TinyURL Integration**: Reliable URL shortening powered by TinyURL API
- **One-Click Shortening**: Instant URL compression with single click
- **Copy to Clipboard**: Quick copying functionality with visual feedback
- **URL Validation**: Smart validation with user-friendly error messages
- **Global Compatibility**: Works with any valid URL worldwide

### 📱 QR Code Generator  
- **Instant Generation**: Create QR codes from any text or URL
- **High Quality**: PNG format with optimal resolution for scanning
- **Download Support**: Save QR codes directly to your device
- **Live Preview**: Real-time QR code preview as you type
- **Versatile Input**: Works with URLs, text, contact info, WiFi credentials

### 🎨 Glassmorphism Design
- **Modern Glass Effects**: Stunning backdrop blur and transparency effects
- **Gradient Backgrounds**: Dynamic purple-blue animated gradients
- **Responsive Layout**: Perfect experience on desktop, tablet, and mobile
- **Smooth Animations**: Elegant hover effects and transitions
- **Dark Theme**: Professional dark mode with glass accents

### � Performance & UX
- **Lightning Fast**: Built with Next.js 14 App Router for optimal performance
- **Real-time Feedback**: Instant loading states and status indicators
- **Error Recovery**: Graceful error handling with helpful messages
- **Accessible**: WCAG compliant with keyboard navigation support

## 🛠 Technology Stack

### Frontend & API
- **Next.js 14**: React framework with App Router and API routes
- **JavaScript**: Modern ES6+ development with full stack in JavaScript
- **React 18**: Modern React with hooks and concurrent features
- **CSS3**: Custom glassmorphism styling with backdrop filters and gradients
- **TinyURL API**: External URL shortening service integration

### Design System
- **Glassmorphism**: Modern glass-effect aesthetic with backdrop blur
- **Gradient Backgrounds**: Dynamic purple-blue animated gradients
- **Responsive Design**: Mobile-first CSS Grid and Flexbox layouts
- **CSS Animations**: Smooth hover effects and transitions
- **Accessibility**: WCAG compliant design patterns

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

3. **Start development server**:
```bash
cd packages/web
npm run dev
```

This starts the Next.js application with API routes at http://localhost:3000

### Development Commands

```bash
# Start the development server
cd packages/web && npm run dev

# Build for production
cd packages/web && npm run build

# Start production server
cd packages/web && npm start

# Lint code
cd packages/web && npm run lint
```

## 📖 Documentation

- **[API Documentation](docs/API.md)** - Complete API reference with examples
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Step-by-step deployment instructions

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tools/url-shortener` | POST | Shorten URL via TinyURL |
| `/api/tools/qr-code` | POST | Generate QR code |

### Example API Usage

**Shorten a URL**:
```bash
curl -X POST https://atoolbox.vercel.app/api/tools/url-shortener \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}'
```

**Generate QR Code**:
```bash
curl -X POST https://atoolbox.vercel.app/api/tools/qr-code \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello World"}'
```

## 🌐 Deployment

The application is configured for seamless deployment on Vercel as a full-stack Next.js application:

1. **Connect GitHub repository** to Vercel
2. **Set Root Directory** to `packages/web`
3. **Deploy automatically** on every push to main branch

The application runs entirely within Next.js API routes, making deployment simple and cost-effective.

See the [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

## 🔧 Configuration

### Environment Variables

No environment variables are required for basic functionality. The application uses:
- **TinyURL API**: Public API, no key required
- **QR Code Generation**: Client-side generation using qrcode library

For development, create `.env.local` in `packages/web/`:
```env
# Optional: Add any custom environment variables here
NODE_ENV=development
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

- [ ] **Enhanced URL Features**: Custom aliases and expiration dates
- [ ] **Analytics Dashboard**: Click tracking and usage statistics  
- [ ] **Batch Operations**: Multiple URL shortening and QR generation
- [ ] **More Tools**: Text utilities, image tools, converters
- [ ] **PWA Features**: Offline mode and app installation
- [ ] **API Authentication**: Rate limiting and usage tracking
- [ ] **Custom Themes**: Multiple glassmorphism color schemes
- [ ] **Export Options**: Bulk QR code downloads and URL lists

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework with App Router
- **TinyURL** - For the reliable URL shortening service
- **Vercel** - For the seamless full-stack deployment platform
- **QRCode.js** - For client-side QR code generation

---

Built with modern glassmorphism design and powered by Next.js 14. Perfect for developers who need quick access to essential tools with a beautiful, professional interface.
