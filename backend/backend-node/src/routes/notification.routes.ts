import { Router } from 'express';
import { getNotifications, markAsRead, getUnreadCount, markAllAsRead, deleteNotification } from '../controllers/notification.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const notificationRouter = Router();

notificationRouter.use(protectRoute);

// Rutas específicas (Deben ir ANTES de las rutas con :id)
notificationRouter.get('/unread-count', getUnreadCount);
notificationRouter.patch('/all/read', markAllAsRead);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Notification'
 */
notificationRouter.get('/', getNotifications);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *       404:
 *         description: Notification not found
 */
notificationRouter.patch('/:id/read', markAsRead);
notificationRouter.delete('/:id', deleteNotification);

export default notificationRouter;
