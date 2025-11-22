import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import { createServer, Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

const allowedOrigins = ['http://localhost:4200'];
const options: cors.CorsOptions = {
  origin: allowedOrigins
};
app.use(cors(options));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Food Rescue Live-Board API and WebSocket Server running.',
    status: 'OK'
  });
});

// TODO: Integrar aquí las rutas
const httpServer: HttpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// TODO: Configurar aquí el manejo de WebSockets de /sockets/donationSocket.ts
io.on('connection', (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.emit('status', 'Conexión WebSocket establecida con éxito.');

  socket.on('disconnect', () => {
    console.log(`Socket desconectado: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Servidor Express y Socket.io escuchando en puerto ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});