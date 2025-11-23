import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  logger.http(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    body: req.method !== 'GET' ? req.body : undefined
  });

  const originalSend = res.send;
  res.send = function (data: any): Response {
    const duration = Date.now() - startTime;

    logger.http(`${req.method} ${req.url} - ${res.statusCode}`, {
      duration: `${duration}ms`,
      statusCode: res.statusCode,
      contentLength: res.get('content-length')
    });

    return originalSend.call(this, data);
  };

  next();
};
