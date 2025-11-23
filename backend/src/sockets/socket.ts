import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

export const initializeSocket = (socketIO: SocketIOServer) => {
  io = socketIO;

  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
