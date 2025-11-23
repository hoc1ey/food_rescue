import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import logger from '../utils/logger.js';

export const getCities = async (req: Request, res: Response) => {
  try {
    logger.info('Fetching all cities');

    const cities = await prisma.city.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    logger.info('Cities retrieved successfully', { count: cities.length });

    return sendSuccess(res, 'Cities retrieved successfully', cities);
  } catch (error) {
    logger.error('Failed to fetch cities', error);
    return sendError(res, 'Failed to fetch cities', error);
  }
};
