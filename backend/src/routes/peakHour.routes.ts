import { Router } from 'express';
import { createPeakHours, getPeakHours } from '../controllers/peakHour.controller.js';
import { protectRoute, restrictTo } from '../middlewares/auth.middleware.js';
import { UserType } from '../generated/prisma/index.js';

const peakHourRouter = Router();

peakHourRouter.use(protectRoute);
peakHourRouter.use(restrictTo(UserType.DONOR));

/**
 * @swagger
 * /api/peak-hours:
 *   post:
 *     summary: Create peak hours (Donors only)
 *     tags: [Peak Hours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - days
 *               - startTime
 *               - endTime
 *             properties:
 *               days:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY]
 *                 example: [MONDAY, WEDNESDAY, FRIDAY]
 *               startTime:
 *                 type: string
 *                 example: "08:00"
 *               endTime:
 *                 type: string
 *                 example: "10:00"
 *               note:
 *                 type: string
 *                 maxLength: 100
 *                 example: Pan fresco del día anterior
 *     responses:
 *       200:
 *         description: Peak hours created successfully
 *       403:
 *         description: Forbidden - Only donors can create peak hours
 */
peakHourRouter.post('/', createPeakHours);

/**
 * @swagger
 * /api/peak-hours:
 *   get:
 *     summary: Get peak hours (Donors only)
 *     tags: [Peak Hours]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Peak hours retrieved successfully
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
 *                         $ref: '#/components/schemas/PeakHour'
 */
peakHourRouter.get('/', getPeakHours);

export default peakHourRouter;
