import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import cityRoutes from './routes/city.routes.js';
import authRoutes from './routes/auth.routes.js';
import peakHourRoutes from './routes/peakHour.routes.js';
import donationRoutes from './routes/donation.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import { initializeSocket } from './sockets/socket.js';
import { requestLogger } from './middlewares/requestLogger.middleware.js';
import logger from './utils/logger.js';
import swaggerSpec from './config/swagger.config.js';

const PORT = process.env.PORT || 3000;
const app = express();

const allowedOrigins = ['http://localhost:4200'];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true
};
app.use(cors(options));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Food Rescue API Documentation'
}));

// Swagger JSON
app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Food Rescue Live-Board API and WebSocket Server running.',
    status: 'OK',
    documentation: '/api-docs'
  });
});

// Routes
app.use('/api/cities', cityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/peak-hours', peakHourRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/notifications', notificationRoutes);

// Manejo de rutas no encontradas
app.use((req: Request, res: Response) => {
  logger.warn('Route not found', {
    method: req.method,
    url: req.url
  });
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Manejo de errores global
app.use((error: any, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

initializeSocket(io);

server.listen(PORT, () => {
  logger.info('Server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    jwtConfigured: !!process.env.JWT_SECRET,
    documentation: `http://localhost:${PORT}/api-docs`
  });
  console.log(`\n======================================================`);
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`📄 API JSON: http://localhost:${PORT}/api-docs.json`);
  console.log(`======================================================\n`);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection', reason);
  process.exit(1);
});
