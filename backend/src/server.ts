import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/database';

const httpServer = createServer(app);

// Socket.IO for real-time features
const io = new SocketServer(httpServer, {
  cors: {
    origin: env.CORS_ORIGIN.split(','),
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });

  // Room for real-time visit updates
  socket.on('join:visits', () => {
    socket.join('visits');
    logger.info(`Client ${socket.id} joined visits room`);
  });

  // Room for real-time notifications
  socket.on('join:notifications', () => {
    socket.join('notifications');
    logger.info(`Client ${socket.id} joined notifications room`);
  });
});

// Export io instance for use in controllers
export { io };

const PORT = parseInt(env.PORT);

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('✅ Database connected successfully');

    httpServer.listen(PORT, () => {
      logger.info(`
      ╔════════════════════════════════════════╗
      ║   SIGECO Backend API Server Started   ║
      ╠════════════════════════════════════════╣
      ║  🚀 Server: http://localhost:${PORT}     ║
      ║  📚 API: http://localhost:${PORT}/api    ║
      ║  ❤️  Health: http://localhost:${PORT}/api/health ║
      ║  🌍 Environment: ${env.NODE_ENV.padEnd(22)}║
      ╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  
  httpServer.close(() => {
    logger.info('HTTP server closed');
  });

  await prisma.$disconnect();
  logger.info('Database connection closed');
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  
  httpServer.close(() => {
    logger.info('HTTP server closed');
  });

  await prisma.$disconnect();
  logger.info('Database connection closed');
  
  process.exit(0);
});

startServer();
