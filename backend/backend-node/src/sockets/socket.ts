import { Server as SocketIOServer, Socket } from 'socket.io';
import logger from '../config/logger.config.js';

let io: SocketIOServer;

export const initializeSocket = (socketIO: SocketIOServer) => {
  io = socketIO;

  io.on('connection', (socket: Socket) => {
    logger.info('Socket connected', {
      socketId: socket.id,
      transport: socket.conn.transport.name
    });

    // Handle user authentication and join their personal room
    socket.on('authenticate', (userId: string) => {
      if (userId) {
        socket.join(userId);
        logger.info('User authenticated', {
          userId: userId,
          socketId: socket.id
        });

        socket.emit('authenticated', {
          success: true,
          userId,
          message: 'Successfully authenticated and joined personal room'
        });
      } else {
        logger.warn('Authentication attempted without userId', {
          socketId: socket.id
        });
      }
    });

    // Handle explicit room join (optional, for additional rooms)
    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      logger.info('User joined room', {
        roomId: roomId,
        socketId: socket.id
      });
    });

    // Handle explicit room leave
    socket.on('leave-room', (roomId: string) => {
      socket.leave(roomId);
      logger.info('User left room', {
        roomId: roomId,
        socketId: socket.id
      });
    });

    socket.on('disconnect', (reason: string) => {
      logger.info('Socket disconnected', {
        socketId: socket.id,
        reason
      });
    });

    socket.on('error', (error: Error) => {
      logger.error('Socket error', {
        error: error.message,
        stack: error.stack,
        socketId: socket.id
      });
    });
  });

  logger.info('WebSocket initialized successfully');
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

