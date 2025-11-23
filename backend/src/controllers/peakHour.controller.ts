import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import logger from '../utils/logger.js';

export const createPeakHours = async (req: Request, res: Response) => {
  try {
    const { days, startTime, endTime, note } = req.body;
    const userId = req.user!.userId;

    logger.info('Creating peak hours', { userId, days });

    // Get donor and their first location
    const donor = await prisma.donor.findUnique({
      where: { userId },
      include: { locations: true }
    });

    if (!donor || donor.locations.length === 0) {
      logger.warn('Peak hours creation failed: Donor location not found', { userId });
      return sendError(res, 'Donor location not found', null, 404);
    }

    const locationId = donor.locations[0].id;

    logger.database('CREATE', 'PeakHour', {
      locationId,
      days,
      startTime,
      endTime
    });

    const peakHour = await prisma.peakHour.create({
      data: {
        day: days,
        startTime,
        endTime,
        note,
        locationId
      }
    });

    logger.info('Peak hours created successfully', {
      peakHourId: peakHour.id,
      userId,
      locationId
    });

    return sendSuccess(res, 'Peak hours created successfully', peakHour);
  } catch (error) {
    logger.error('Failed to create peak hours', error);
    return sendError(res, 'Failed to create peak hours', error);
  }
};

export const getPeakHours = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    logger.info('Fetching peak hours', { userId });

    const donor = await prisma.donor.findUnique({
      where: { userId },
      include: {
        locations: {
          include: {
            peakHours: true
          }
        }
      }
    });

    if (!donor) {
      logger.warn('Peak hours fetch failed: Donor not found', { userId });
      return sendError(res, 'Donor not found', null, 404);
    }

    const peakHours = donor.locations[0]?.peakHours || [];

    logger.info('Peak hours retrieved successfully', {
      userId,
      count: peakHours.length
    });

    return sendSuccess(res, 'Peak hours retrieved successfully', peakHours);
  } catch (error) {
    logger.error('Failed to fetch peak hours', error);
    return sendError(res, 'Failed to fetch peak hours', error);
  }
};

export const updatePeakHour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { days, startTime, endTime, note } = req.body;
    const userId = req.user!.userId;

    logger.info('Updating peak hour', { peakHourId: id, userId });

    // Verify ownership
    const donor = await prisma.donor.findUnique({
      where: { userId },
      include: {
        locations: {
          include: {
            peakHours: true
          }
        }
      }
    });

    if (!donor) {
      logger.warn('Peak hour update failed: Donor not found', { userId });
      return sendError(res, 'Donor not found', null, 404);
    }

    const peakHour = donor.locations[0]?.peakHours.find(ph => ph.id === parseInt(id));

    if (!peakHour) {
      logger.warn('Peak hour update failed: Peak hour not found or unauthorized', {
        peakHourId: id,
        userId
      });
      return sendError(res, 'Peak hour not found or unauthorized', null, 404);
    }

    logger.database('UPDATE', 'PeakHour', { peakHourId: id });

    const updatedPeakHour = await prisma.peakHour.update({
      where: { id: parseInt(id) },
      data: {
        day: days,
        startTime,
        endTime,
        note
      }
    });

    logger.info('Peak hour updated successfully', { peakHourId: id, userId });

    return sendSuccess(res, 'Peak hour updated successfully', updatedPeakHour);
  } catch (error) {
    logger.error('Failed to update peak hour', error);
    return sendError(res, 'Failed to update peak hour', error);
  }
};

export const deletePeakHour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    logger.info('Deleting peak hour', { peakHourId: id, userId });

    // Verify ownership
    const donor = await prisma.donor.findUnique({
      where: { userId },
      include: {
        locations: {
          include: {
            peakHours: true
          }
        }
      }
    });

    if (!donor) {
      logger.warn('Peak hour deletion failed: Donor not found', { userId });
      return sendError(res, 'Donor not found', null, 404);
    }

    const peakHour = donor.locations[0]?.peakHours.find(ph => ph.id === parseInt(id));

    if (!peakHour) {
      logger.warn('Peak hour deletion failed: Peak hour not found or unauthorized', {
        peakHourId: id,
        userId
      });
      return sendError(res, 'Peak hour not found or unauthorized', null, 404);
    }

    logger.database('DELETE', 'PeakHour', { peakHourId: id });

    await prisma.peakHour.delete({
      where: { id: parseInt(id) }
    });

    logger.info('Peak hour deleted successfully', { peakHourId: id, userId });

    return sendSuccess(res, 'Peak hour deleted successfully', null);
  } catch (error) {
    logger.error('Failed to delete peak hour', error);
    return sendError(res, 'Failed to delete peak hour', error);
  }
};
