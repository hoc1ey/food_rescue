import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import logger from '../utils/logger.js';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    logger.info('Fetching notifications', { userId });

    const notifications = await prisma.notification.findMany({
      where: { userId },
      include: {
        donation: {
          select: {
            id: true,
            productName: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    logger.info('Notifications retrieved successfully', {
      userId,
      count: notifications.length,
      unreadCount: notifications.filter(n => !n.isRead).length
    });

    return sendSuccess(res, 'Notifications retrieved successfully', notifications);
  } catch (error) {
    logger.error('Failed to fetch notifications', error);
    return sendError(res, 'Failed to fetch notifications', error);
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    logger.info('Marking notification as read', { notificationId: id, userId });

    const notification = await prisma.notification.findFirst({
      where: { id: parseInt(id), userId }
    });

    if (!notification) {
      logger.warn('Notification mark as read failed: Notification not found', {
        notificationId: id,
        userId
      });
      return sendError(res, 'Notification not found', null, 404);
    }

    logger.database('UPDATE', 'Notification', {
      notificationId: id,
      isRead: true
    });

    const updatedNotification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { isRead: true }
    });

    logger.info('Notification marked as read successfully', {
      notificationId: id,
      userId
    });

    return sendSuccess(res, 'Notification marked as read', updatedNotification);
  } catch (error) {
    logger.error('Failed to mark notification as read', error);
    return sendError(res, 'Failed to mark notification as read', error);
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    logger.info('Marking all notifications as read', { userId });

    logger.database('UPDATE', 'Notification', {
      userId,
      action: 'markAllAsRead'
    });

    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: { isRead: true }
    });

    logger.info('All notifications marked as read successfully', {
      userId,
      updatedCount: result.count
    });

    return sendSuccess(res, 'All notifications marked as read', {
      updatedCount: result.count
    });
  } catch (error) {
    logger.error('Failed to mark all notifications as read', error);
    return sendError(res, 'Failed to mark all notifications as read', error);
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    logger.info('Deleting notification', { notificationId: id, userId });

    const notification = await prisma.notification.findFirst({
      where: { id: parseInt(id), userId }
    });

    if (!notification) {
      logger.warn('Notification deletion failed: Notification not found', {
        notificationId: id,
        userId
      });
      return sendError(res, 'Notification not found', null, 404);
    }

    logger.database('DELETE', 'Notification', { notificationId: id });

    await prisma.notification.delete({
      where: { id: parseInt(id) }
    });

    logger.info('Notification deleted successfully', {
      notificationId: id,
      userId
    });

    return sendSuccess(res, 'Notification deleted successfully', null);
  } catch (error) {
    logger.error('Failed to delete notification', error);
    return sendError(res, 'Failed to delete notification', error);
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    logger.info('Fetching unread notification count', { userId });

    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });

    logger.info('Unread notification count retrieved', { userId, count });

    return sendSuccess(res, 'Unread count retrieved successfully', { count });
  } catch (error) {
    logger.error('Failed to fetch unread count', error);
    return sendError(res, 'Failed to fetch unread count', error);
  }
};
