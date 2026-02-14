import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import './config/firebase-admin.js'; // Initialize Firebase Admin
import authRoutes from './features/auth/auth.routes.js';
import chatRoutes from './features/chat/chat.routes.js';
import aiRoutes from './features/ai/ai.routes.js';
import competitionRoutes from './features/competitions/competition.routes.js';
import analyticsRoutes from './features/analytics/analytics.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initSocket } from './services/socket.service.js';

// Load .env from backend directory so GEMINI_API_KEY etc. are found regardless of cwd
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // fallback to process.cwd() .env

if (process.env.GEMINI_API_KEY) {
  console.log('✅ AI Assistant (Gemini) is configured');
} else {
  console.warn('⚠️ GEMINI_API_KEY not set – AI Assistant will be disabled. Add it to backend/.env');
}

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
connectDB();

// Health Check API
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Taakra backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Chat Routes
app.use('/api/chat', chatRoutes);

// AI Assistant Routes
app.use('/api/ai', aiRoutes);

// Competition Routes
app.use('/api', competitionRoutes);

// Analytics (admin/organizer)
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use(errorHandler);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// Initialize Socket.io
initSocket(httpServer);

// Start Server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
