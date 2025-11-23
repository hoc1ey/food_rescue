import logger from '../config/logger.config.js';

class Logger {
  // Log de información
  info(message: string, meta?: any) {
    logger.info(message, meta);
  }

  // Log de error
  error(message: string, error?: any) {
    if (error instanceof Error) {
      logger.error(message, {
        error: error.message,
        stack: error.stack,
        ...error
      });
    } else {
      logger.error(message, { error });
    }
  }

  // Log de advertencia
  warn(message: string, meta?: any) {
    logger.warn(message, meta);
  }

  // Log de debug
  debug(message: string, meta?: any) {
    logger.debug(message, meta);
  }

  // Log de HTTP requests
  http(message: string, meta?: any) {
    logger.http(message, meta);
  }

  // Log estructurado para operaciones de base de datos
  database(operation: string, table: string, details?: any) {
    logger.info(`DB Operation: ${operation}`, {
      table,
      ...details
    });
  }

  // Log para eventos de WebSocket
  websocket(event: string, socketId: string, data?: any) {
    logger.info(`WebSocket: ${event}`, {
      socketId,
      ...data
    });
  }

  // Log para autenticación
  auth(action: string, userId?: string, details?: any) {
    logger.info(`Auth: ${action}`, {
      userId,
      ...details
    });
  }
}

export default new Logger();
