import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import './config/firebase-admin.js'; // Initialize Firebase Admin
import authRoutes from './features/auth/auth.routes.js';
import chatRoutes from './features/chat/chat.routes.js';
import competitionRoutes from './features/competitions/competition.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initSocket } from './services/socket.service.js';

dotenv.config();

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

// Competition Routes
app.use('/api', competitionRoutes);

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
