import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import { healthRouter } from './routes/health';
import { toolsRouter } from './routes/tools';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Basic middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/tools', toolsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Toolbox API MVP is running! 🚀',
    version: '1.0.0',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/tools/url-shortener',
      'POST /api/tools/qr-code'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});

export default app;