import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { getIO } from '../sockets/socket.js';
import logger from '../utils/logger.js';

const UserType = {
  DONOR: 'DONOR',
  BENEFICIARY: 'BENEFICIARY'
} as const;

const DonationStatus = {
  AVAILABLE: 'AVAILABLE',
  ASSIGNED: 'ASSIGNED',
  DELIVERED: 'DELIVERED'
} as const;

export const createDonation = async (req: Request, res: Response) => {
  try {
    const { productName, quantity, unit } = req.body;
    const userId = req.user!.userId;

    logger.info('Creating donation', { userId, productName, quantity, unit });

    // Validación de entrada para evitar errores de Prisma
    if (!productName || quantity === undefined || quantity === null || !unit) {
      return sendError(res, 'Faltan campos requeridos: productName, quantity, unit', null, 400);
    }

    const quantityNum = Number(quantity);
    if (isNaN(quantityNum)) {
      return sendError(res, 'La cantidad debe ser un número válido', null, 400);
    }

    const donor = await prisma.donor.findUnique({
      where: { userId },
      include: { locations: true }
    });

    if (!donor || donor.locations.length === 0) {
      logger.warn('Donation creation failed: Donor location not found', { userId });
      return sendError(res, 'Donor location not found', null, 404);
    }

    logger.database('CREATE', 'Donation', {
      donorId: donor.id,
      productName,
      quantity: quantityNum
    });

    const donation = await prisma.donation.create({
      data: {
        productName,
        quantity: quantityNum,
        unit,
        donorId: donor.id,
        locationId: donor.locations[0].id
      },
      include: {
        location: {
          include: {
            city: true
          }
        },
        donor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    logger.info('Donation created successfully', {
      donationId: donation.id,
      userId,
      productName
    });

    // Create notifications for all beneficiaries
    const beneficiaries = await prisma.beneficiary.findMany({
      include: { user: true }
    });

    logger.info('Creating notifications for beneficiaries', {
      donationId: donation.id,
      beneficiaryCount: beneficiaries.length
    });

    const io = getIO();

    for (const beneficiary of beneficiaries) {
      const notification = await prisma.notification.create({
        data: {
          message: `New donation available: ${productName}`,
          type: 'DONATION_CREATED',
          userId: beneficiary.userId,
          donationId: donation.id
        }
      });

      // Emit notification to specific user
      logger.info('Emitting notification:new event', {
        userId: beneficiary.userId,
        notificationId: notification.id,
        donationId: donation.id
      });

      io.to(beneficiary.userId).emit('notification:new', {
        id: notification.id,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        userId: notification.userId,
        donationId: notification.donationId
      });
    }

    // Emit WebSocket event
    logger.info('Emitting donation:created event', {
      target: 'broadcast',
      donationId: donation.id
    });

    io.emit('donation:created', donation);

    return sendSuccess(res, 'Donation created successfully', donation);
  } catch (error) {
    logger.error('Failed to create donation', error);
    return sendError(res, 'Failed to create donation', error);
  }
};

export const getDonations = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const userType = req.user!.userType;

    logger.info('Fetching donations', { userId, userType });

    let donations;

    if (userType === UserType.DONOR) {
      const donor = await prisma.donor.findUnique({
        where: { userId }
      });

      if (!donor) {
        logger.warn('Donations fetch failed: Donor not found', { userId });
        return sendError(res, 'Donor not found', null, 404);
      }

      logger.database('READ', 'Donation', { donorId: donor.id });

      donations = await prisma.donation.findMany({
        where: { donorId: donor.id },
        include: {
          location: {
            include: { city: true }
          },
          beneficiary: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      logger.database('READ', 'Donation', {
        filter: 'AVAILABLE or assigned to user'
      });

      donations = await prisma.donation.findMany({
        where: {
          OR: [
            { status: DonationStatus.AVAILABLE },
            { beneficiaryId: userId }
          ]
        },
        include: {
          location: {
            include: { city: true }
          },
          donor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    logger.info('Donations retrieved successfully', {
      userId,
      count: donations.length
    });

    return sendSuccess(res, 'Donations retrieved successfully', donations);
  } catch (error) {
    logger.error('Failed to fetch donations', error);
    return sendError(res, 'Failed to fetch donations', error);
  }
};

export const claimDonation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const donationId = parseInt(id);

    if (isNaN(donationId)) {
      return sendError(res, 'Invalid donation ID', null, 400);
    }

    const userId = req.user!.userId;

    logger.info('Claiming donation', { donationId, userId });

    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        donor: {
          include: { user: true }
        }
      }
    });

    if (!donation) {
      logger.warn('Donation claim failed: Donation not found', { donationId });
      return sendError(res, 'Donation not found', null, 404);
    }

    if (donation.status !== DonationStatus.AVAILABLE) {
      logger.warn('Donation claim failed: Donation not available', {
        donationId,
        status: donation.status
      });
      return sendError(res, 'Donation is not available', null, 400);
    }

    logger.database('UPDATE', 'Donation', {
      donationId,
      action: 'claim',
      beneficiaryId: userId
    });

    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        beneficiaryId: userId,
        status: DonationStatus.ASSIGNED
      },
      include: {
        location: {
          include: { city: true }
        },
        beneficiary: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        donor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    logger.info('Donation claimed successfully', {
      donationId,
      beneficiaryId: userId
    });

    // Create notification for donor
    await prisma.notification.create({
      data: {
        message: `Your donation "${donation.productName}" has been claimed`,
        type: 'DONATION_CLAIMED',
        userId: donation.donor.userId,
        donationId: donation.id
      }
    });

    // Emit WebSocket events
    logger.info('Emitting donation:claimed event', {
      target: 'broadcast',
      donationId
    });

    const io = getIO();
    io.emit('donation:claimed', updatedDonation);

    return sendSuccess(res, 'Donation claimed successfully', updatedDonation);
  } catch (error) {
    logger.error('Failed to claim donation', error);
    return sendError(res, 'Failed to claim donation', error);
  }
};

export const confirmDonation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const donationId = parseInt(id);

    if (isNaN(donationId)) {
      return sendError(res, 'Invalid donation ID', null, 400);
    }

    const userId = req.user!.userId;
    const userType = req.user!.userType;

    logger.info('Confirming donation', { donationId, userId, userType });

    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        donor: true,
        beneficiary: true
      }
    });

    if (!donation) {
      logger.warn('Donation confirmation failed: Donation not found', {
        donationId
      });
      return sendError(res, 'Donation not found', null, 404);
    }

    if (donation.status !== DonationStatus.ASSIGNED) {
      logger.warn('Donation confirmation failed: Invalid status', {
        donationId,
        status: donation.status
      });
      return sendError(res, 'Donation is not in assigned status', null, 400);
    }

    let updateData: any = {};

    if (userType === UserType.DONOR && donation.donor.userId === userId) {
      updateData.donorConfirmed = true;
      logger.info('Donor confirmed donation', { donationId, userId });
    } else if (userType === UserType.BENEFICIARY && donation.beneficiaryId === userId) {
      updateData.beneficiaryConfirmed = true;
      logger.info('Beneficiary confirmed donation', { donationId, userId });
    } else {
      logger.warn('Donation confirmation failed: Unauthorized', {
        donationId,
        userId
      });
      return sendError(res, 'Unauthorized to confirm this donation', null, 403);
    }

    logger.database('UPDATE', 'Donation', {
      donationId,
      action: 'confirm',
      ...updateData
    });

    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: updateData
    });

    // Check if both confirmed
    if (
      (updatedDonation.donorConfirmed && updatedDonation.beneficiaryConfirmed) ||
      (updateData.donorConfirmed && donation.beneficiaryConfirmed) ||
      (donation.donorConfirmed && updateData.beneficiaryConfirmed)
    ) {
      logger.info('Both parties confirmed, marking as delivered', {
        donationId
      });

      logger.database('UPDATE', 'Donation', {
        donationId,
        status: 'DELIVERED'
      });

      const finalDonation = await prisma.donation.update({
        where: { id: donationId },
        data: { status: DonationStatus.DELIVERED },
        include: {
          location: {
            include: { city: true }
          },
          beneficiary: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          donor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      // Create notifications
      await prisma.notification.create({
        data: {
          message: `Donation "${donation.productName}" has been delivered`,
          type: 'DONATION_DELIVERED',
          userId: donation.donor.userId,
          donationId: donation.id
        }
      });

      await prisma.notification.create({
        data: {
          message: `Donation "${donation.productName}" has been delivered`,
          type: 'DONATION_DELIVERED',
          userId: donation.beneficiaryId!,
          donationId: donation.id
        }
      });

      logger.info('Donation delivered successfully', { donationId });

      // Emit WebSocket event
      logger.info('Emitting donation:delivered event', {
        target: 'broadcast',
        donationId
      });

      const io = getIO();
      io.emit('donation:delivered', finalDonation);

      return sendSuccess(res, 'Donation confirmed and delivered', finalDonation);
    }

    logger.info('Donation confirmation recorded', {
      donationId,
      ...updateData
    });

    return sendSuccess(res, 'Donation confirmation recorded', updatedDonation);
  } catch (error) {
    logger.error('Failed to confirm donation', error);
    return sendError(res, 'Failed to confirm donation', error);
  }
};
